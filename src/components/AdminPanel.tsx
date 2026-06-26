import React, { useState, useEffect } from "react";
import { 
  Lock, User, LogOut, Calendar, AlertTriangle, 
  CheckCircle, Trash2, LayoutDashboard, Plus, 
  Search, Download, TrendingUp, DollarSign, Users, Filter,
  FileText, Printer, X
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface Booking {
  id: number;
  location: string;
  screen: string;
  occasion: string;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  addons: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string;
  amountPaid: number;
  createdAt: string;
}

interface BlockedSlot {
  id: number;
  location: string;
  screen: string;
  date: string;
  timeSlot: string;
  reason: string;
  createdAt: string;
}

const locations = ["Hebbal", "Dr. Rajkumar Road", "Kuvempunagar"];
const screens = [
  "Standard Dolby Screen (1-4 Guests)",
  "Lounge Screen (Couple Special)",
  "Celebration Screen (Party 5-10 Guests)",
  "VIP Royal Suite Screen (10+ Guests)",
];
const timeSlots = [
  "11:00 AM - 02:00 PM",
  "02:30 PM - 05:30 PM",
  "06:00 PM - 09:00 PM",
  "09:30 PM - 12:30 AM",
];

export const AdminPanel: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("bys_admin_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Tab states: "bookings" | "blocker"
  const [activeTab, setActiveTab] = useState<"bookings" | "blocker">("bookings");
  
  // Data lists
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected Booking for Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  // Blocker Form State
  const [blockLocation, setBlockLocation] = useState(locations[0]);
  const [blockScreen, setBlockScreen] = useState(screens[0]);
  const [blockDate, setBlockDate] = useState("");
  const [blockTimeSlot, setBlockTimeSlot] = useState(timeSlots[0]);
  const [blockReason, setBlockReason] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "");

  // Set Auth headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login credentials invalid.");
      }
      localStorage.setItem("bys_admin_token", data.token);
      setToken(data.token);
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bys_admin_token");
    setToken(null);
    setBookings([]);
    setBlockedSlots([]);
  };

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load bookings.");
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message);
      if (resStatusUnauthorized(err)) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedSlots = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/blocked`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load blocked slots.");
      setBlockedSlots(data.blocked || []);
    } catch (err: any) {
      setError(err.message);
      if (resStatusUnauthorized(err)) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const resStatusUnauthorized = (err: any) => {
    return err.message && (err.message.includes("Token") || err.message.includes("expired") || err.message.includes("401") || err.message.includes("403"));
  };

  const handleUpdateBookingStatus = async (id: number, newStatus: string) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/update-booking`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update booking status.");
      
      setSuccessMsg("Booking status updated successfully!");
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!blockDate) {
      setError("Please pick a blocking date.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/block-slot`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          location: blockLocation,
          screen: blockScreen,
          date: blockDate,
          timeSlot: blockTimeSlot,
          reason: blockReason || "Maintenance"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to block slot.");

      setSuccessMsg("Time slot blocked successfully!");
      setBlockReason("");
      fetchBlockedSlots();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnblockSlot = async (id: number) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/unblock-slot/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to unblock slot.");
      }
      setSuccessMsg("Time slot successfully unblocked!");
      fetchBlockedSlots();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Download all bookings as CSV report (Excel compatible)
  const downloadCSVReport = () => {
    if (filteredBookings.length === 0) return;

    const headers = [
      "ID",
      "Booking Date",
      "Time Slot",
      "Location",
      "Screen",
      "Occasion",
      "Customer Name",
      "Phone Number",
      "Add-ons Selected",
      "Amount Paid (INR)",
      "Razorpay Payment ID",
      "Razorpay Order ID",
      "Status",
      "Reservation Created At"
    ];

    const csvRows = filteredBookings.map(b => {
      const addonList = b.addons ? JSON.parse(b.addons).join(" | ") : "None";
      return [
        b.id,
        b.date,
        b.timeSlot,
        `"${b.location.replace(/"/g, '""')}"`,
        `"${b.screen.replace(/"/g, '""')}"`,
        `"${b.occasion.replace(/"/g, '""')}"`,
        `"${b.name.replace(/"/g, '""')}"`,
        `'${b.phone}`, // preserved phone format for excel
        `"${addonList.replace(/"/g, '""')}"`,
        b.amountPaid,
        b.razorpayPaymentId || "N/A",
        b.razorpayOrderId || "N/A",
        b.status,
        b.createdAt
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bys_sales_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDFInvoice = async (booking: Booking) => {
    const element = document.getElementById("invoice-print-area");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_BYS_100${booking.id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const downloadMonthlySalesReportPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(26, 26, 26);
      pdf.text("BOOK YOUR SCREEN", 14, 20);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.text("Premium Private Cinemas - Past Monthly Sales Report", 14, 25);
      pdf.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 30);
      
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(212, 175, 55);
      pdf.line(14, 35, 196, 35);
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(26, 26, 26);
      pdf.text("Billing Month", 20, 48);
      pdf.text("Gross Sales Revenue", 140, 48);
      
      pdf.setLineWidth(0.3);
      pdf.setDrawColor(224, 224, 224);
      pdf.line(14, 52, 196, 52);
      
      let y = 60;
      
      if (monthlySalesList.length === 0) {
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(153, 153, 153);
        pdf.text("No confirmed sales history found.", 20, y);
      } else {
        monthlySalesList.forEach((m, idx) => {
          if (idx > 0) {
            pdf.setLineWidth(0.1);
            pdf.setDrawColor(240, 240, 240);
            pdf.line(14, y - 6, 196, y - 6);
          }
          
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(26, 26, 26);
          pdf.text(m.label.toUpperCase(), 20, y);
          
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(170, 124, 17);
          pdf.text(`INR ${m.revenue.toLocaleString("en-IN")}`, 140, y);
          
          y += 12;
        });
      }
      
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(212, 175, 55);
      pdf.line(14, y, 196, y);
      
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(26, 26, 26);
      pdf.text("Total Accumulated Revenue:", 20, y);
      
      pdf.setTextColor(170, 124, 17);
      pdf.text(`INR ${totalRevenue.toLocaleString("en-IN")}`, 140, y);
      
      pdf.save(`monthly_sales_report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate monthly sales PDF. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchBlockedSlots();
    }
  }, [token]);

  // Analytics Computations
  const confirmedBookings = bookings.filter(b => b.status === "Confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const averageOrderValue = confirmedBookings.length > 0 ? Math.round(totalRevenue / confirmedBookings.length) : 0;

  // Monthly Sales computation
  const getMonthlySales = () => {
    const monthlyData: { [key: string]: number } = {};
    confirmedBookings.forEach(b => {
      if (!b.date) return;
      const monthKey = b.date.substring(0, 7); // YYYY-MM
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + b.amountPaid;
    });
    return Object.entries(monthlyData)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, rev]) => {
        const dateObj = new Date(month + "-02");
        const label = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        return { label, revenue: rev, rawMonth: month };
      });
  };

  const monthlySalesList = getMonthlySales();

  // Filter application
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.screen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.id).includes(searchTerm);

    const matchesLocation = locationFilter === "All" || b.location === locationFilter;
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  // Calculate Base Price for Invoice
  const getBaseInvoicePrice = (screenStr: string) => {
    if (screenStr.includes("Standard") || screenStr.includes("Lounge")) return 1499;
    if (screenStr.includes("Celebration")) return 2199;
    return 2799;
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen bg-[#fffdf9] text-text-primary flex items-center justify-center p-6 relative font-sans">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#d4af37]/[0.03] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white border border-[#d4af37]/35 p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(212,175,55,0.08)] relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] flex items-center justify-center mx-auto mb-4 p-[1.5px] shadow-md">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span className="font-display italic text-lg font-black text-black select-none">BY</span>
              </div>
            </div>
            <h1 className="text-xl font-display font-black tracking-widest text-text-primary">BYS ADMIN ACCESS</h1>
            <p className="text-[9px] text-[#aa7c11] uppercase tracking-widest mt-1.5 font-black">Authorized Console Only</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37] transition-all"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-accent w-4 h-4" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37] transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full text-white font-bold text-xs uppercase tracking-[2px] bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer mt-2"
            >
              Sign In to Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // REDESIGNED LIGHT-THEME PREMIUM ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#fffdf9] text-text-primary flex flex-col font-sans relative">
      
      {/* Top Header Bar Matching Navbar style */}
      <header className="border-b border-stroke/60 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] flex items-center justify-center p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="font-display italic text-xs font-black text-black">BY</span>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-text-primary">BYS ADMIN CONTROL ROOM</h1>
            <p className="text-[9px] text-[#aa7c11] font-bold uppercase tracking-wider">System Live • SQLite Secured</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#fffdf9] p-1 rounded-full border border-stroke/60">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-full px-4 py-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "bookings" 
                  ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white shadow-sm" 
                  : "text-muted hover:text-text-primary"
              }`}
            >
              <LayoutDashboard size={12} />
              Bookings Registry
            </button>
            <button
              onClick={() => setActiveTab("blocker")}
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-full px-4 py-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "blocker" 
                  ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white shadow-sm" 
                  : "text-muted hover:text-text-primary"
              }`}
            >
              <Calendar size={12} />
              Block slots
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[10px] text-red-600 hover:text-red-500 font-bold uppercase tracking-wider bg-red-50 border border-red-200 px-3.5 py-2 rounded-full transition-all cursor-pointer"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Analytics Section Row */}
        {activeTab === "bookings" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            
            {/* Gross revenue card */}
            <div className="bg-white border border-[#d4af37]/25 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#aa7c11]">
                <DollarSign size={22} />
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-black block">Gross Revenue</span>
                <span className="text-xl font-display font-black text-text-primary italic">₹{totalRevenue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Total confirmed bookings card */}
            <div className="bg-white border border-[#d4af37]/25 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <CheckCircle size={22} />
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-black block">Paid bookings</span>
                <span className="text-lg font-bold text-text-primary">{confirmedBookings.length} confirmed</span>
              </div>
            </div>

            {/* Average Ticket card */}
            <div className="bg-white border border-[#d4af37]/25 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#aa7c11]/10 flex items-center justify-center text-[#aa7c11]">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-black block">Avg. Sale size</span>
                <span className="text-xl font-display font-black text-text-primary italic">₹{averageOrderValue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Current month sales helper card */}
            <div className="bg-white border border-[#d4af37]/25 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users size={22} />
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-black block">Current Month</span>
                <span className="text-xl font-display font-black text-text-primary italic">
                  ₹{(monthlySalesList[0]?.revenue || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 1: Bookings Registry list */}
        {activeTab === "bookings" && (
          <div className="flex flex-col gap-6">
            
            {/* Registry Toolbar (Excel Sort, Filters & Search) */}
            <div className="bg-white border border-stroke/60 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              
              <div className="flex flex-wrap items-center gap-4 flex-grow">
                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    placeholder="Search name, phone, screen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
                </div>

                {/* Location Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter size={12} className="text-muted" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Branches</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                {/* Status Filter Dropdown */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Export CSV & Reload Log */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={downloadCSVReport}
                  disabled={filteredBookings.length === 0}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white px-4 py-2.5 rounded-xl hover:opacity-90 shadow-md shadow-[#d4af37]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Download size={13} />
                  Download Excel / CSV
                </button>
                
                <button 
                  onClick={fetchBookings}
                  className="text-[10px] font-black uppercase tracking-widest bg-white border border-stroke hover:bg-[#fffdf9] px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Reload registry
                </button>
              </div>

            </div>

            {/* Excel Grid Layout */}
            {loading ? (
              <div className="text-center py-20 text-muted/60 text-xs font-black uppercase tracking-widest animate-pulse">
                Fetching entries from SQLite core database...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-stroke/60 rounded-3xl text-muted/60 text-xs font-black uppercase tracking-widest">
                No matching reservation rows found.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Excel styled sheet grid container */}
                <div className="overflow-x-auto border border-stroke/80 rounded-2xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs font-sans table-auto">
                    <thead>
                      <tr className="border-b border-stroke bg-neutral-100/80 text-text-primary uppercase text-[9px] tracking-wider font-black select-none">
                        <th className="p-3.5 border-r border-stroke">ID</th>
                        <th className="p-3.5 border-r border-stroke">Date</th>
                        <th className="p-3.5 border-r border-stroke">Time Slot</th>
                        <th className="p-3.5 border-r border-stroke">Branch / Screen</th>
                        <th className="p-3.5 border-r border-stroke">Customer Name</th>
                        <th className="p-3.5 border-r border-stroke">Contact Phone</th>
                        <th className="p-3.5 border-r border-stroke">Selected Addons</th>
                        <th className="p-3.5 border-r border-stroke">Paid Amount</th>
                        <th className="p-3.5 border-r border-stroke">Razorpay Ref</th>
                        <th className="p-3.5 border-r border-stroke">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke">
                      {filteredBookings.map((b, idx) => (
                        <tr 
                          key={b.id} 
                          className={`hover:bg-[#d4af37]/5 transition-all font-medium text-text-primary ${
                            idx % 2 === 0 ? "bg-[#fffdf9]/30" : "bg-white"
                          }`}
                        >
                          <td className="p-3.5 font-bold text-text-primary border-r border-stroke">#{b.id}</td>
                          <td className="p-3.5 border-r border-stroke whitespace-nowrap">{b.date}</td>
                          <td className="p-3.5 border-r border-stroke whitespace-nowrap text-[10px] font-bold text-text-primary">{b.timeSlot}</td>
                          <td className="p-3.5 border-r border-stroke">
                            <span className="font-bold text-text-primary block truncate max-w-[120px]">{b.location}</span>
                            <span className="text-[9px] text-muted block truncate max-w-[130px]">{b.screen.split(" (")[0]}</span>
                          </td>
                          <td className="p-3.5 border-r border-stroke text-text-primary font-bold whitespace-nowrap">{b.name}</td>
                          <td className="p-3.5 border-r border-stroke font-mono whitespace-nowrap">{b.phone}</td>
                          <td className="p-3.5 border-r border-stroke max-w-[180px]">
                            {b.addons ? (
                              <div className="flex flex-wrap gap-1">
                                {JSON.parse(b.addons).map((ad: string, i: number) => (
                                  <span key={i} className="bg-neutral-100 border border-stroke px-1.5 py-0.5 rounded text-[8px] text-muted font-bold">
                                    {ad.split(" (+")[0]}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted/30 italic">None</span>
                            )}
                          </td>
                          <td className="p-3.5 border-r border-stroke font-bold text-[#aa7c11] whitespace-nowrap">₹{b.amountPaid}</td>
                          <td className="p-3.5 border-r border-stroke font-mono text-[9px] text-muted select-all">
                            {b.razorpayPaymentId || "Mock / N/A"}
                          </td>
                          <td className="p-3.5 border-r border-stroke">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              b.status === "Confirmed" 
                                ? "bg-green-100 border border-green-200 text-green-700" 
                                : b.status === "Pending" 
                                ? "bg-amber-100 border border-amber-200 text-amber-700" 
                                : "bg-red-100 border border-red-200 text-red-700"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1 items-center">
                              <button
                                onClick={() => setSelectedInvoice(b)}
                                className="bg-[#d4af37]/15 border border-[#d4af37]/45 text-[#aa7c11] hover:bg-[#d4af37]/25 px-2 py-1 rounded font-black text-[8px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-0.5"
                              >
                                <FileText size={10} />
                                Invoice
                              </button>
                              {b.status !== "Confirmed" && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                                  className="bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 px-2 py-1 rounded font-black text-[8px] uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status !== "Cancelled" && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                                  className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 px-2 py-1 rounded font-black text-[8px] uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Monthly Sales Breakdown Sub-Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  
                  {/* Past Monthly History Sales Summary */}
                  <div className="bg-white border border-[#d4af37]/25 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text-primary flex items-center gap-1.5">
                        <TrendingUp size={16} className="text-[#aa7c11]" /> Past Monthly Sales History
                      </h3>
                      <button
                        onClick={downloadMonthlySalesReportPDF}
                        disabled={monthlySalesList.length === 0}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider bg-[#d4af37]/15 border border-[#d4af37]/45 text-[#aa7c11] hover:bg-[#d4af37]/25 px-3 py-1.5 rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-sm"
                      >
                        <Download size={10} />
                        Download PDF
                      </button>
                    </div>
                    <div className="border border-stroke rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="border-b border-stroke bg-neutral-100/50 text-muted font-black text-[9px] uppercase tracking-wider">
                            <th className="p-3">Billing Month</th>
                            <th className="p-3 text-right">Gross Sales Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stroke">
                          {monthlySalesList.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="p-4 text-center text-muted/40 italic">
                                No confirmed sales history.
                              </td>
                            </tr>
                          ) : (
                            monthlySalesList.map((m, idx) => (
                              <tr key={idx} className="hover:bg-neutral-50">
                                <td className="p-3 text-text-primary font-bold uppercase tracking-wider">{m.label}</td>
                                <td className="p-3 text-right font-display text-base font-black text-[#aa7c11] italic">
                                  ₹{m.revenue.toLocaleString("en-IN")}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Excel usage tips box */}
                  <div className="bg-white border border-[#d4af37]/25 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-3">
                        Spreadsheet Integration Note
                      </h3>
                      <p className="text-xs text-muted leading-relaxed font-semibold">
                        The downloaded spreadsheet report utilizes comma-separated values (.csv) format, compatible with Microsoft Excel, Google Sheets, or Apple Numbers. 
                      </p>
                      <ul className="text-[10px] text-muted/80 list-disc pl-4 mt-3 space-y-1.5 font-bold uppercase tracking-wide">
                        <li>Customer contact phones are correctly formatted to prevent truncation.</li>
                        <li>Includes transaction codes for signature matching.</li>
                        <li>Preserves detailed add-ons breakdown string segments.</li>
                      </ul>
                    </div>

                    <button
                      onClick={downloadCSVReport}
                      disabled={filteredBookings.length === 0}
                      className="w-full mt-6 py-3 rounded-xl text-white font-bold text-[10px] uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa7c11] hover:opacity-90 shadow-md shadow-[#d4af37]/10 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download size={13} />
                      Export Current Registry to Excel (.CSV)
                    </button>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manual Blocker Panel */}
        {activeTab === "blocker" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Blocker Form */}
            <div className="bg-white border border-[#d4af37]/25 rounded-3xl p-6 h-fit flex flex-col gap-5 shadow-sm">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary flex items-center gap-1.5">
                  <Plus size={16} className="text-[#aa7c11]" /> Block Specific Slot
                </h3>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Manually block slots for cleaning, maintenance, private events, or VIP lockouts.
                </p>
              </div>

              <form onSubmit={handleBlockSlot} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-muted mb-1.5">Location Branch</label>
                  <select
                    value={blockLocation}
                    onChange={(e) => setBlockLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-muted mb-1.5">Screen Room</label>
                  <select
                    value={blockScreen}
                    onChange={(e) => setBlockScreen(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {screens.map(scr => <option key={scr} value={scr}>{scr}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-muted mb-1.5">Select Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37] [color-scheme:light] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-muted mb-1.5">Time Slot</label>
                  <select
                    value={blockTimeSlot}
                    onChange={(e) => setBlockTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-muted mb-1.5">Blocking Reason (Notes)</label>
                  <input
                    type="text"
                    placeholder="VIP Special request, cleanups etc."
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stroke bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl text-white font-bold text-[10px] uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa7c11] hover:opacity-90 shadow-md shadow-[#d4af37]/10 transition-all cursor-pointer"
                >
                  Confirm Block Request
                </button>
              </form>
            </div>

            {/* Blocked Slots Table List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white border border-[#d4af37]/20 p-5 rounded-3xl shadow-sm">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Blocked Schedule Calendar</h3>
                  <p className="text-[11px] text-muted">Currently manually disabled slots where booking checks will show Blocked.</p>
                </div>
                <button
                  onClick={fetchBlockedSlots}
                  className="text-[9px] font-black uppercase tracking-wider bg-white border border-stroke hover:bg-[#fffdf9] px-3.5 py-2 rounded-full transition-all cursor-pointer"
                >
                  Refresh Blocks
                </button>
              </div>

              {loading ? (
                <div className="text-center py-20 text-muted/60 text-xs font-black uppercase tracking-widest animate-pulse">
                  Querying database entries...
                </div>
              ) : blockedSlots.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-stroke/60 rounded-3xl text-muted/60 text-xs font-black uppercase tracking-widest bg-white">
                  No slots blocked at any branch.
                </div>
              ) : (
                <div className="border border-stroke rounded-3xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="border-b border-stroke bg-neutral-100 text-muted uppercase text-[9px] tracking-wider font-black">
                        <th className="p-4 border-r border-stroke">Branch</th>
                        <th className="p-4 border-r border-stroke">Date / Slot</th>
                        <th className="p-4 border-r border-stroke">Screen / Reason</th>
                        <th className="p-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke">
                      {blockedSlots.map((bs) => (
                        <tr key={bs.id} className="hover:bg-neutral-50 transition-all text-text-primary">
                          <td className="p-4 font-bold text-[#aa7c11] border-r border-stroke">
                            {bs.location}
                          </td>
                          <td className="p-4 border-r border-stroke">
                            <span className="block font-bold text-text-primary">{bs.date}</span>
                            <span className="text-[10px] text-muted block mt-0.5">{bs.timeSlot}</span>
                          </td>
                          <td className="p-4 border-r border-stroke">
                            <span className="block text-text-primary font-bold">{bs.screen.split(" (")[0]}</span>
                            <span className="text-[10px] text-muted block mt-0.5 italic">"{bs.reason}"</span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleUnblockSlot(bs.id)}
                              className="text-red-600 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg border border-red-200 transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ENGLISH PDF/PRINTABLE INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4af37]/35 w-full max-w-xl rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-6 top-6 text-muted hover:text-text-primary cursor-pointer p-1 rounded-full hover:bg-neutral-100"
            >
              <X size={20} />
            </button>

            {/* Printable Area ID */}
            <div id="invoice-print-area" className="flex flex-col gap-6 text-text-primary font-sans p-2">
              
              {/* Header: Brand Name & Date */}
              <div className="flex justify-between items-start border-b border-stroke pb-6 mt-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] flex items-center justify-center p-[1px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span className="font-display italic text-[10px] font-black text-black">BY</span>
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase text-text-primary tracking-[3px]">
                      BOOK YOUR SCREEN
                    </span>
                  </div>
                  <p className="text-[10px] text-muted tracking-wide leading-relaxed">
                    Premium Private Cinemas & Surprise Celebrations<br />
                    Mysuru, Karnataka, India
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#aa7c11] mb-1">INVOICE</h2>
                  <p className="text-[10px] text-muted font-bold">INV-BYS-100{selectedInvoice.id}</p>
                  <p className="text-[9px] text-muted font-medium mt-1">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>

              {/* Client & Booking details */}
              <div className="grid grid-cols-2 gap-4 text-[10px] bg-[#fffdf9]/60 border border-[#d4af37]/25 p-4 rounded-2xl">
                <div>
                  <span className="block text-[8px] text-muted font-black uppercase tracking-wider mb-1">Billed To</span>
                  <span className="block font-bold text-text-primary text-xs">{selectedInvoice.name}</span>
                  <span className="block font-medium text-muted mt-0.5">{selectedInvoice.phone}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-muted font-black uppercase tracking-wider mb-1">Reservation details</span>
                  <span className="block font-bold text-text-primary">{selectedInvoice.location}</span>
                  <span className="block font-medium text-muted mt-0.5">{selectedInvoice.date} ({selectedInvoice.timeSlot})</span>
                </div>
              </div>

              {/* Occasion / Screen note */}
              <div className="text-[10px] bg-neutral-50 px-4 py-2.5 rounded-xl border border-stroke flex justify-between">
                <span>Occasion: <strong>{selectedInvoice.occasion}</strong></span>
                <span>Screen Room: <strong>{selectedInvoice.screen.split(" (")[0]}</strong></span>
              </div>

              {/* Charges Summary Table */}
              <div>
                <span className="block text-[8px] text-muted font-black uppercase tracking-wider mb-2">Itemized Charges</span>
                <div className="border border-stroke rounded-xl overflow-hidden text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stroke bg-neutral-50 text-[9px] font-black uppercase text-muted">
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke">
                      <tr>
                        <td className="p-3">
                          <span className="font-bold text-text-primary">{selectedInvoice.screen.split(" (")[0]}</span>
                          <span className="block text-[8px] text-muted">Base session screening charges</span>
                        </td>
                        <td className="p-3 text-right font-bold">₹{getBaseInvoicePrice(selectedInvoice.screen).toLocaleString("en-IN")}</td>
                      </tr>
                      {selectedInvoice.addons && JSON.parse(selectedInvoice.addons).map((ad: string, i: number) => {
                        const amountStr = ad.match(/\+₹(\d+)/)?.[1] || "0";
                        const amount = parseInt(amountStr, 10);
                        return (
                          <tr key={i}>
                            <td className="p-3 text-muted">{ad.split(" (+")[0]} (Upgrade Add-on)</td>
                            <td className="p-3 text-right font-semibold">₹{amount.toLocaleString("en-IN")}</td>
                          </tr>
                        );
                      })}
                      <tr className="border-t-2 border-stroke bg-[#fffdf9] font-black text-text-primary text-xs">
                        <td className="p-3 text-right">Grand Total Paid:</td>
                        <td className="p-3 text-right text-[#aa7c11]">₹{selectedInvoice.amountPaid.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Details */}
              <div className="text-[9px] text-muted border-t border-stroke pt-4 flex justify-between items-center">
                <div>
                  <span className="block font-bold">Gateway: Razorpay Checkout SECURE</span>
                  <span>Ref ID: {selectedInvoice.razorpayPaymentId || "manual_or_sandbox"}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-green-100 border border-green-200 text-green-700 font-black uppercase text-[8px] tracking-wider">
                    {selectedInvoice.status} / PAID
                  </span>
                </div>
              </div>

              {/* T&C */}
              <div className="text-[7.5px] text-muted/80 leading-relaxed border-t border-stroke/50 pt-4">
                <strong>Important Notice:</strong> Booking advance payments confirm slot lockouts instantly and are strictly non-refundable and non-postponable. Please coordinate surprise cakes, decorations and photography details with the WhatsApp customer coordinator.
              </div>

            </div>

            {/* Print and Download Actions */}
            <div className="mt-8 flex justify-end gap-3 border-t border-stroke pt-4">
              <button
                onClick={() => {
                  const printContents = document.getElementById("invoice-print-area")?.innerHTML;
                  if (printContents) {
                    // Create window print helper
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Invoice INV-BYS-100${selectedInvoice.id}</title>
                            <style>
                              body { font-family: sans-serif; padding: 40px; background: white; color: #1a1a1a; }
                              .flex { display: flex; }
                              .justify-between { justify-content: space-between; }
                              .items-start { align-items: flex-start; }
                              .items-center { align-items: center; }
                              .grid { display: grid; }
                              .grid-cols-2 { grid-template-cols: 1fr 1fr; }
                              .gap-4 { gap: 16px; }
                              .border-b { border-bottom: 1px solid #e0e0e0; }
                              .border-t { border-top: 1px solid #e0e0e0; }
                              .border-t-2 { border-top: 2px solid #1a1a1a; }
                              .pb-6 { padding-bottom: 24px; }
                              .pt-4 { padding-top: 16px; }
                              .mb-2 { margin-bottom: 8px; }
                              .mb-1 { margin-bottom: 4px; }
                              .mt-4 { margin-top: 16px; }
                              .text-xs { font-size: 12px; }
                              .text-sm { font-size: 14px; }
                              .font-black { font-weight: 900; }
                              .font-bold { font-weight: 700; }
                              .text-muted { color: #666; }
                              .text-[#aa7c11] { color: #aa7c11; }
                              table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                              th, td { padding: 12px; text-align: left; font-size: 11px; }
                              tr { border-bottom: 1px solid #e0e0e0; }
                              th { background: #f5f5f5; font-weight: 900; text-transform: uppercase; font-size: 9px; }
                              .bg-neutral-50 { background: #fafafa; padding: 10px 16px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 12px; }
                              .bg-[#fffdf9] { background: #fffdf9; }
                              .rounded-2xl { border-radius: 12px; }
                              .border { border: 1px solid #e0e0e0; }
                              .p-4 { padding: 16px; }
                              .px-2.5 { padding: 4px 10px; }
                              .py-1 { padding: 4px; }
                              .rounded { border-radius: 4px; }
                              .bg-green-100 { background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; }
                              .text-[8px] { font-size: 10px; }
                              .tracking-wider { tracking: 1px; }
                            </style>
                          </head>
                          <body onload="window.print();window.close();">
                            ${printContents}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#d4af37] text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                <Printer size={14} />
                Print Invoice
              </button>

              <button
                onClick={() => downloadPDFInvoice(selectedInvoice)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all cursor-pointer shadow-md shadow-[#d4af37]/10"
              >
                <Download size={14} />
                Download PDF
              </button>
              
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-xs font-bold uppercase tracking-wider bg-neutral-100 border border-stroke text-text-primary px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
