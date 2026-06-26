import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useLocation } from "./LocationContext";

const screens = [
  "Standard Dolby Screen (1-4 Guests)",
  "Lounge Screen (Couple Special)",
  "Celebration Screen (Party 5-10 Guests)",
  "VIP Royal Suite Screen (10+ Guests)",
];

const occasions = [
  "Birthday Celebration",
  "Anniversary Special",
  "Romantic Movie Date",
  "Friend's Reunion / Party",
  "Marriage Proposal Setup",
  "Naming Ceremony",
  "Small Family Pooja",
  "Other / Custom Celebration",
];

const timeSlots = [
  "11:00 AM - 02:00 PM",
  "02:30 PM - 05:30 PM",
  "06:00 PM - 09:00 PM",
  "09:30 PM - 12:30 AM",
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const BookingForm: React.FC = () => {
  const { activeLocation } = useLocation();
  
  // Fields
  const [selectedScreen, setSelectedScreen] = useState(screens[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Customization add-ons
  const [decor, setDecor] = useState(false);
  const [cake, setCake] = useState(false);
  const [food, setFood] = useState(false);
  const [photography, setPhotography] = useState(false);

  // Statuses
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const API_BASE = window.location.hostname === "localhost" ? "http://localhost:5000" : "";

  // Base price calculation
  const getBasePrice = () => {
    if (selectedScreen.includes("Standard") || selectedScreen.includes("Lounge")) return 1499;
    if (selectedScreen.includes("Celebration")) return 2199;
    return 2799;
  };

  const getAddonsPrice = () => {
    let total = 0;
    if (decor) total += 500;
    if (cake) total += 400;
    if (food) total += 600;
    if (photography) total += 1000;
    return total;
  };

  const totalAmount = getBasePrice() + getAddonsPrice();

  // Query availability when location, screen or date changes
  useEffect(() => {
    if (!date) return;
    
    const checkAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const response = await fetch(`${API_BASE}/api/check-availability`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: activeLocation,
            screen: selectedScreen,
            date: date
          })
        });
        const data = await response.json();
        if (data.unavailable) {
          setUnavailableSlots(data.unavailable);
          // If current selected time slot is now unavailable, change it to first available
          if (data.unavailable.includes(timeSlot)) {
            const available = timeSlots.find(ts => !data.unavailable.includes(ts));
            if (available) setTimeSlot(available);
          }
        }
      } catch (err) {
        console.error("Availability lookup failure:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    checkAvailability();
  }, [activeLocation, selectedScreen, date, API_BASE]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setErrorMessage("Please select a date.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (unavailableSlots.includes(timeSlot)) {
      setErrorMessage("This time slot is already booked. Please choose another one.");
      return;
    }

    setBookingStatus("processing");
    setErrorMessage("");

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment SDK. Check your internet connection.");
      }

      // 2. Format custom add-ons list
      const addons: string[] = [];
      if (decor) addons.push("Party Decorations (+₹500)");
      if (cake) addons.push("Celebration Cake (+₹400)");
      if (food) addons.push("Snacks & Drinks (+₹600)");
      if (photography) addons.push("Professional Photo Package (+₹1000)");

      // 3. Create Pending Reservation Order in Backend SQLite
      const orderRes = await fetch(`${API_BASE}/api/create-booking-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: activeLocation,
          screen: selectedScreen,
          occasion: selectedOccasion,
          date,
          timeSlot,
          name,
          phone,
          addons,
          amount: totalAmount
        })
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || "Failed to initiate reservation.");
      }

      const orderData = await orderRes.json();
      const { razorpayOrderId, key, bookingId, isSandbox } = orderData;

      // 4. Open Razorpay payment gateway checkout modal
      const options = {
        key: key,
        amount: totalAmount * 100, // paise
        currency: "INR",
        name: "Book Your Screen",
        description: `${selectedScreen} booking at ${activeLocation}`,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            setBookingStatus("processing");
            // 5. Verify signature and confirm status in DB
            const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id || "sandbox_success",
                amountPaid: totalAmount
              })
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed on the server.");
            }

            // Success confetti and status
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#ffd700", "#b8860b", "#d4af37", "#f3e5ab"],
            });

            setConfirmedBookingId(bookingId);
            setBookingStatus("success");

            // Format message for WhatsApp redirect
            const waAddons = addons.length > 0 ? addons.join(", ") : "None";
            const waMessage = `Hello Book Your Screen! I have successfully paid and confirmed my booking. Here are my details:
- *Booking ID:* BYS-DB-${bookingId}
- *Location:* ${activeLocation}
- *Screen:* ${selectedScreen}
- *Occasion:* ${selectedOccasion}
- *Date:* ${date}
- *Time Slot:* ${timeSlot}
- *Name:* ${name}
- *Phone:* ${phone}
- *Add-ons:* ${waAddons}
- *Amount Paid:* ₹${totalAmount}

Please coordinate decoration and setup. Thank you!`;

            const encodedText = encodeURIComponent(waMessage);
            const whatsappUrl = `https://wa.me/919019333970?text=${encodedText}`;
            
            // Auto open whatsapp shortly after success
            setTimeout(() => {
              window.open(whatsappUrl, "_blank");
            }, 3000);

          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "Failed to confirm payment details.");
            setBookingStatus("error");
          }
        },
        prefill: {
          name: name,
          contact: phone
        },
        theme: {
          color: "#d4af37"
        },
        modal: {
          ondismiss: function() {
            setBookingStatus("idle");
          }
        }
      };

      if (isSandbox) {
        // Mock Sandbox Payment Mode if Razorpay Keys are not configured in backend .env
        console.log("Mock gateway triggered: completing transaction manually");
        setTimeout(async () => {
          options.handler({ razorpay_payment_id: "mock_payment_" + Date.now() });
        }, 1200);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong during checkout.");
      setBookingStatus("error");
    }
  };

  if (bookingStatus === "success") {
    return (
      <section id="booking" className="bg-[#fffdf9] py-24 md:py-32 border-t border-stroke/40 relative">
        <div className="max-w-[600px] mx-auto px-6 relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8 border border-green-200">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-display text-text-primary italic mb-4 font-bold">
            Booking <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent not-italic font-black">Confirmed!</span>
          </h2>
          <p className="text-sm font-semibold text-text-primary mb-2">
            Reference ID: BYS-DB-{confirmedBookingId}
          </p>
          <p className="text-xs text-muted max-w-md mx-auto mb-8 leading-relaxed">
            Your booking for <strong>{selectedScreen}</strong> at our <strong>{activeLocation}</strong> branch has been successfully paid and recorded in our secure SQLite database. We are now redirecting you to WhatsApp to coordinate any custom setup or special arrangements!
          </p>

          <button
            onClick={() => {
              const waAddons = [decor && "Party Decor", cake && "Cake", food && "Snacks", photography && "Photos"].filter(Boolean).join(", ") || "None";
              const waMessage = `Hello Book Your Screen! I have successfully paid and confirmed my booking. Here are my details:
- *Booking ID:* BYS-DB-${confirmedBookingId}
- *Location:* ${activeLocation}
- *Screen:* ${selectedScreen}
- *Occasion:* ${selectedOccasion}
- *Date:* ${date}
- *Time Slot:* ${timeSlot}
- *Name:* ${name}
- *Phone:* ${phone}
- *Add-ons:* ${waAddons}
- *Amount Paid:* ₹${totalAmount}

Please coordinate decoration and setup. Thank you!`;
              window.open(`https://wa.me/919019333970?text=${encodeURIComponent(waMessage)}`, "_blank");
            }}
            className="px-8 py-4.5 rounded-full text-white font-bold text-xs uppercase tracking-[2px] bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            Open WhatsApp Coordinator Manually ↗
          </button>

          <button
            onClick={() => {
              setBookingStatus("idle");
              setName("");
              setPhone("");
              setDate("");
              setConfirmedBookingId(null);
            }}
            className="block text-center w-full mt-6 text-xs text-muted hover:text-text-primary transition-all font-bold"
          >
            Make Another Booking
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="bg-[#fffdf9] py-24 md:py-32 border-t border-stroke/40 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-[#d4af37]/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[720px] mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-[10px] text-accent uppercase tracking-[4px] font-black mb-4 bg-[#d4af37]/10 px-4.5 py-2 rounded-full border border-[#d4af37]/20">
            Booking & Reservation
          </span>
          <h2 className="text-4xl md:text-6xl font-display text-text-primary italic mb-4 font-bold">
            Schedule your <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Celebration</span>
          </h2>
          <p className="text-xs md:text-sm text-muted max-w-md leading-relaxed font-semibold">
            Currently displaying slots for <strong>{activeLocation}</strong>. Book securely online via Razorpay, and lock your screen instantly.
          </p>
        </div>

        <form
          onSubmit={handleBooking}
          className="bg-white border border-[#d4af37]/25 rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(212,175,55,0.06)]"
        >
          <div className="flex flex-col gap-6">
            
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* 1. Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(val);
                  }}
                  className="w-full px-5 py-3.5 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Screen Type Selector */}
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                Select Private Screen
              </label>
              <div className="relative">
                <select
                  value={selectedScreen}
                  onChange={(e) => setSelectedScreen(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  {screens.map((scr) => (
                    <option key={scr} value={scr}>
                      {scr}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. Occasion Dropdown Selector */}
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                Choose Celebration Event
              </label>
              <div className="relative">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  {occasions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 4. Date & Time Slots (Dual Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent [color-scheme:light] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                  Choose Time Slot {loadingAvailability && "(Checking...)"}
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    disabled={!date || loadingAvailability}
                    className="w-full px-5 py-4 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer disabled:opacity-50"
                  >
                    {!date ? (
                      <option>Select a date first</option>
                    ) : (
                      timeSlots.map((ts) => {
                        const isBooked = unavailableSlots.includes(ts);
                        return (
                          <option key={ts} value={ts} disabled={isBooked}>
                            {ts} {isBooked ? "❌ [BOOKED]" : "🟢 [AVAILABLE]"}
                          </option>
                        );
                      })
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Add-on Checkbox Packages */}
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-3">
                Customize Surprise Add-ons (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <label className={`flex items-center gap-3 p-4 bg-[#fffdf9] border rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all ${decor ? "border-[#d4af37]" : "border-stroke/60"}`}>
                  <input
                    type="checkbox"
                    checked={decor}
                    onChange={(e) => setDecor(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Party Decorations (+₹500)</h5>
                    <p className="text-[9px] text-muted font-medium">Balloons, lighting overlays, sashes</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 bg-[#fffdf9] border rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all ${cake ? "border-[#d4af37]" : "border-stroke/60"}`}>
                  <input
                    type="checkbox"
                    checked={cake}
                    onChange={(e) => setCake(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Birthday Cake (+₹400)</h5>
                    <p className="text-[9px] text-muted font-medium">Fresh, customized half-kg pastry cake</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 bg-[#fffdf9] border rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all ${food ? "border-[#d4af37]" : "border-stroke/60"}`}>
                  <input
                    type="checkbox"
                    checked={food}
                    onChange={(e) => setFood(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Snacks & Drinks (+₹600)</h5>
                    <p className="text-[9px] text-muted font-medium">Signature mocktails & hot starters</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 bg-[#fffdf9] border rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all ${photography ? "border-[#d4af37]" : "border-stroke/60"}`}>
                  <input
                    type="checkbox"
                    checked={photography}
                    onChange={(e) => setPhotography(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Photography (+₹1000)</h5>
                    <p className="text-[9px] text-muted font-medium">Premium digital photoshoot package</p>
                  </div>
                </label>

              </div>
            </div>

            {/* Price Summary */}
            <div className="p-6 bg-[#fffdf9] border border-[#d4af37]/20 rounded-2xl flex justify-between items-center mt-2">
              <div>
                <span className="text-[9px] text-muted font-black uppercase tracking-wider block">Total Reservation Fee</span>
                <span className="text-2xl font-display font-black text-[#aa7c11] italic">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#aa7c11] font-bold block uppercase tracking-wider">Adv. Payment Confirms Slot</span>
                <span className="text-[8px] text-muted font-medium">Fully secure through Razorpay</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={bookingStatus === "processing"}
              className="w-full mt-4 text-center py-4.5 rounded-full text-white font-bold text-xs uppercase tracking-[2px] bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingStatus === "processing" ? "Initializing Razorpay..." : `Pay ₹${totalAmount.toLocaleString("en-IN")} & Book Screen Now ↗`}
            </button>

          </div>
        </form>

      </div>
    </section>
  );
};

