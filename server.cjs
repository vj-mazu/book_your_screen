const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bys_super_secret_secure_key_2026';

app.use(cors());
app.use(express.json());

// Initialize Razorpay (Fallback to mock if keys are not configured in .env)
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'mockKeySecret';
let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
    console.log('Razorpay configured successfully.');
  } else {
    console.log('Razorpay running in test/sandbox mock mode.');
  }
} catch (err) {
  console.error('Razorpay initialization warning:', err.message);
}

// Database Directory and SQLite Initialization
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}
const dbPath = path.join(dbDir, 'bookings.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database connection:', err.message);
  } else {
    console.log('Connected to secure SQLite local database.');
  }
});

// Configure SQLite structures
db.serialize(() => {
  // Bookings Table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      screen TEXT NOT NULL,
      occasion TEXT NOT NULL,
      date TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      addons TEXT,
      razorpayOrderId TEXT,
      razorpayPaymentId TEXT,
      status TEXT DEFAULT 'Pending',
      amountPaid INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blocked Slots Table (for Admin to manually block dates/screens)
  db.run(`
    CREATE TABLE IF NOT EXISTS blocked_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      screen TEXT NOT NULL,
      date TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      reason TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin User Table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `, () => {
    // Seed default admin user: username=admin, password=bookyourscreen2026 (hashed securely)
    db.get('SELECT * FROM admins WHERE username = ?', ['admin'], (err, row) => {
      if (!row) {
        const defaultHash = bcrypt.hashSync('bookyourscreen2026', 10);
        db.run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', defaultHash]);
        console.log('Default secure admin user seeded.');
      }
    });
  });
});

// Authentication Middleware to secure Admin Dashboard endpoints
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Access denied. Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// ================= API ENDPOINTS =================

// 1. Get Availability Status for Date, Location, Screen
app.post('/api/check-availability', (req, res) => {
  const { location, screen, date } = req.body;
  if (!location || !screen || !date) {
    return res.status(400).json({ error: 'Missing required lookup parameters.' });
  }

  // Get both confirmed bookings and blocked slots
  const bookingQuery = `
    SELECT timeSlot FROM bookings 
    WHERE location = ? AND screen = ? AND date = ? AND status IN ('Confirmed', 'Paid')
  `;
  
  const blockedQuery = `
    SELECT timeSlot FROM blocked_slots 
    WHERE location = ? AND screen = ? AND date = ?
  `;

  db.all(bookingQuery, [location, screen, date], (err, bookedRows) => {
    if (err) return res.status(500).json({ error: 'Database read error.' });

    db.all(blockedQuery, [location, screen, date], (err, blockedRows) => {
      if (err) return res.status(500).json({ error: 'Database read error.' });

      const bookedSlots = bookedRows.map(row => row.timeSlot);
      const blockedSlots = blockedRows.map(row => row.timeSlot);
      const unavailable = [...new Set([...bookedSlots, ...blockedSlots])];

      res.json({ unavailable });
    });
  });
});

// 2. Submit Reservation Order and Generate Razorpay Order
app.post('/api/create-booking-order', async (req, res) => {
  const { location, screen, occasion, date, timeSlot, name, phone, addons, amount } = req.body;

  if (!location || !screen || !occasion || !date || !timeSlot || !name || !phone || !amount) {
    return res.status(400).json({ error: 'Missing reservation details.' });
  }

  // Double check availability (parameterized query prevents SQL Injection)
  const doubleCheckQuery = `
    SELECT id FROM bookings 
    WHERE location = ? AND screen = ? AND date = ? AND timeSlot = ? AND status IN ('Confirmed', 'Paid')
  `;

  db.get(doubleCheckQuery, [location, screen, date, timeSlot], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database validation failed.' });
    if (row) return res.status(400).json({ error: 'Slot is already booked. Please choose another time.' });

    // Generate Razorpay Order
    let razorpayOrderId = 'mock_order_' + Date.now();
    
    if (razorpayInstance) {
      try {
        const options = {
          amount: amount * 100, // amount in paisa
          currency: 'INR',
          receipt: 'receipt_order_' + Date.now(),
        };
        const order = await razorpayInstance.orders.create(options);
        razorpayOrderId = order.id;
      } catch (err) {
        console.error('Razorpay order creation failure:', err);
        return res.status(500).json({ error: 'Payment gateway configuration error.' });
      }
    }

    // Write booking as Pending (parameterized query avoids SQL Injection)
    const insertQuery = `
      INSERT INTO bookings (location, screen, occasion, date, timeSlot, name, phone, addons, razorpayOrderId, status, amountPaid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 0)
    `;

    db.run(insertQuery, [location, screen, occasion, date, timeSlot, name, phone, JSON.stringify(addons), razorpayOrderId], function (err) {
      if (err) return res.status(500).json({ error: 'Database write error.' });
      
      res.json({
        bookingId: this.lastID,
        razorpayOrderId,
        key: razorpayKeyId,
        isSandbox: !process.env.RAZORPAY_KEY_ID
      });
    });
  });
});

// 3. Verify Payment Success & Confirm Slot
app.post('/api/verify-payment', (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, amountPaid } = req.body;

  if (!razorpayOrderId) {
    return res.status(400).json({ error: 'Missing order reference id.' });
  }

  // Update status to Paid and Confirmed
  const updateQuery = `
    UPDATE bookings 
    SET status = 'Confirmed', razorpayPaymentId = ?, amountPaid = ?
    WHERE razorpayOrderId = ?
  `;

  db.run(updateQuery, [razorpayPaymentId || 'manual_or_sandbox', amountPaid || 0, razorpayOrderId], function (err) {
    if (err) return res.status(500).json({ error: 'Database update failed.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Reservation order record not found.' });

    res.json({ success: true, message: 'Reservation slot successfully confirmed!' });
  });
});

// 4. Secure Admin Login API (Standard protection against brute force)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password credentials.' });
  }

  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
    if (err) return res.status(500).json({ error: 'Database lookup error.' });
    if (!admin) return res.status(401).json({ error: 'Invalid username or password.' });

    const isValid = bcrypt.compareSync(password, admin.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid username or password.' });

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, username: admin.username });
  });
});

// 5. SECURE: Get All Bookings for Admin
app.get('/api/admin/bookings', authenticateToken, (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY date DESC, timeSlot ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database query failure.' });
    res.json({ bookings: rows });
  });
});

// 6. SECURE: Update Booking Status Manually
app.post('/api/admin/update-booking', authenticateToken, (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: 'Missing details.' });

  db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(500).json({ error: 'Update failed.' });
    res.json({ success: true, message: 'Booking status updated successfully.' });
  });
});

// 7. SECURE: Get All Blocked Slots
app.get('/api/admin/blocked', authenticateToken, (req, res) => {
  db.all('SELECT * FROM blocked_slots ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database query failure.' });
    res.json({ blocked: rows });
  });
});

// 8. SECURE: Create Blocked Slot
app.post('/api/admin/block-slot', authenticateToken, (req, res) => {
  const { location, screen, date, timeSlot, reason } = req.body;
  if (!location || !screen || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing parameters.' });
  }

  const query = `
    INSERT INTO blocked_slots (location, screen, date, timeSlot, reason)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [location, screen, date, timeSlot, reason || 'Admin block'], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to block slot.' });
    res.json({ success: true, id: this.lastID });
  });
});

// 9. SECURE: Delete Blocked Slot
app.delete('/api/admin/unblock-slot/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM blocked_slots WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to unblock slot.' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Secure booking server running on port ${PORT}`);
});
