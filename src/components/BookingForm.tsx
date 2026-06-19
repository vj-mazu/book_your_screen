import React, { useState } from "react";
import confetti from "canvas-confetti";

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

export const BookingForm: React.FC = () => {
  const [selectedScreen, setSelectedScreen] = useState(screens[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  
  // Customization add-ons
  const [decor, setDecor] = useState(false);
  const [cake, setCake] = useState(false);
  const [food, setFood] = useState(false);
  const [photography, setPhotography] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fire Confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffd700", "#b8860b", "#d4af37", "#f3e5ab"],
    });

    // Format WhatsApp message
    const addons = [];
    if (decor) addons.push("Full Surprise Room Decoration");
    if (cake) addons.push("Fresh Pastry Cake (Half Kg)");
    if (food) addons.push("Gourmet Snacks & Mocktails Package");
    if (photography) addons.push("Professional Photography");

    const message = `Hello Book Your Screen! I would like to book a private theatre screen. Here are my details:
- *Screen:* ${selectedScreen}
- *Occasion:* ${selectedOccasion}
- *Date:* ${date || "Not Specified"}
- *Time Slot:* ${timeSlot}
- *Custom Add-ons:* ${addons.length > 0 ? addons.join(", ") : "None"}

Please confirm availability!`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919019333970?text=${encodedText}`;

    // Open WhatsApp immediately
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="booking" className="bg-[#fffdf9] py-24 md:py-32 border-t border-stroke/40 relative">
      {/* Dynamic ambient gold background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-[#d4af37]/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[720px] mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-[10px] text-accent uppercase tracking-[4px] font-black mb-4 bg-[#d4af37]/10 px-4.5 py-2 rounded-full border border-[#d4af37]/20">
            Booking Coordinator
          </span>
          <h2 className="text-4xl md:text-6xl font-display text-text-primary italic mb-4 font-bold">
            Schedule your <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Celebration</span>
          </h2>
          <p className="text-xs md:text-sm text-muted max-w-md leading-relaxed font-semibold">
            Choose your occasion, date, and preferred timings from the drop-downs. Tap submit to send your reservation request directly to our team via WhatsApp.
          </p>
        </div>

        {/* Redesigned Premium Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#d4af37]/25 rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(212,175,55,0.06)]"
        >
          <div className="flex flex-col gap-6">
            
            {/* 1. Screen Type Selector */}
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                1. Select Private Screen
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

            {/* 2. Occasion Dropdown Selector */}
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                2. Choose Celebration Event
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

            {/* 3. Date & Time Slots (Dual Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                  3. Select Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent [color-scheme:light] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                  4. Choose Time Slot
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-stroke/60 bg-[#fffdf9] text-xs font-bold text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
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
            </div>

            {/* 4. Add-on Checkbox Packages */}
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-wider mb-3">
                5. Customize Surprise Add-ons (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <label className="flex items-center gap-3 p-4 bg-[#fffdf9] border border-stroke/60 rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all">
                  <input
                    type="checkbox"
                    checked={decor}
                    onChange={(e) => setDecor(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Party Decorations</h5>
                    <p className="text-[9px] text-muted font-medium">Balloons, lighting overlays, sashes</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-[#fffdf9] border border-stroke/60 rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all">
                  <input
                    type="checkbox"
                    checked={cake}
                    onChange={(e) => setCake(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Birthday Cake</h5>
                    <p className="text-[9px] text-muted font-medium">Fresh, customized half-kg pastry cake</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-[#fffdf9] border border-stroke/60 rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all">
                  <input
                    type="checkbox"
                    checked={food}
                    onChange={(e) => setFood(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Snacks & Drinks</h5>
                    <p className="text-[9px] text-muted font-medium">Signature mocktails & hot starters</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-[#fffdf9] border border-stroke/60 rounded-2xl cursor-pointer hover:border-[#d4af37]/55 transition-all">
                  <input
                    type="checkbox"
                    checked={photography}
                    onChange={(e) => setPhotography(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Professional Photography</h5>
                    <p className="text-[9px] text-muted font-medium">Premium digital photoshoot package</p>
                  </div>
                </label>

              </div>
            </div>

            {/* Redesigned Submit button with Premium gold styling */}
            <button
              type="submit"
              className="w-full mt-4 text-center py-4.5 rounded-full text-white font-bold text-xs uppercase tracking-[2px] bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              Send Booking Request on WhatsApp ↗
            </button>

          </div>
        </form>

      </div>
    </section>
  );
};
