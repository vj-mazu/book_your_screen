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
      colors: ["#4E85BF", "#89AACC", "#4b5563", "#000000"],
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

    // Open WhatsApp immediately to prevent browser popup blockers from stopping it
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="booking" className="bg-bg py-24 md:py-32 border-t border-stroke/40">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold mb-4">
            Reservation Planner
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-4 leading-tight">
            Schedule your <span className="italic font-normal">celebration</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
            Customize your private booking details below and connect with our team directly via WhatsApp to block your slot.
          </p>
        </div>

        {/* Interactive Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-stroke/60 rounded-[2.5rem] p-6 md:p-12 shadow-sm"
        >
          {/* Grid Selection */}
          <div className="flex flex-col gap-8">
            
            {/* 1. Screen Selection */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3">
                1. Select Private Screen
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {screens.map((scr) => (
                  <button
                    type="button"
                    key={scr}
                    onClick={() => setSelectedScreen(scr)}
                    className={`text-left px-5 py-3.5 rounded-2xl text-xs font-semibold border transition-all duration-300 ${
                      selectedScreen === scr
                        ? "border-accent bg-accent/5 text-text-primary shadow-sm"
                        : "border-stroke/60 bg-bg text-muted hover:border-stroke hover:text-text-primary"
                    }`}
                  >
                    {scr}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Occasion Selection */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3">
                2. Choose Occasion
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {occasions.map((occ) => (
                  <button
                    type="button"
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`text-center px-4 py-3 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                      selectedOccasion === occ
                        ? "border-accent bg-accent/5 text-text-primary shadow-sm"
                        : "border-stroke/60 bg-bg text-muted hover:border-stroke hover:text-text-primary"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3">
                  3. Select Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-stroke/60 bg-bg text-xs font-semibold text-text-primary focus:outline-none focus:border-accent [color-scheme:light]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3">
                  4. Choose Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-stroke/60 bg-bg text-xs font-semibold text-text-primary focus:outline-none focus:border-accent"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Custom Packages Add-ons */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3">
                5. Customize Surprise Add-ons (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <label className="flex items-center gap-3 p-4 bg-bg border border-stroke/60 rounded-2xl cursor-pointer hover:border-stroke transition-all">
                  <input
                    type="checkbox"
                    checked={decor}
                    onChange={(e) => setDecor(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Party Decorations</h5>
                    <p className="text-[10px] text-muted">Balloons, light tags, flower setup</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-bg border border-stroke/60 rounded-2xl cursor-pointer hover:border-stroke transition-all">
                  <input
                    type="checkbox"
                    checked={cake}
                    onChange={(e) => setCake(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Birthday Cake</h5>
                    <p className="text-[10px] text-muted">Fresh, custom half-kg pastry cake</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-bg border border-stroke/60 rounded-2xl cursor-pointer hover:border-stroke transition-all">
                  <input
                    type="checkbox"
                    checked={food}
                    onChange={(e) => setFood(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Snacks & Drinks</h5>
                    <p className="text-[10px] text-muted">Special mocktails and gourmet bites</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-bg border border-stroke/60 rounded-2xl cursor-pointer hover:border-stroke transition-all">
                  <input
                    type="checkbox"
                    checked={photography}
                    onChange={(e) => setPhotography(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">Photography</h5>
                    <p className="text-[10px] text-muted">Professional photoshoot during celebration</p>
                  </div>
                </label>

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 text-center py-4 rounded-full text-white font-semibold text-xs md:text-sm uppercase tracking-wider accent-gradient shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
            >
              Send Booking Request on WhatsApp ↗
            </button>

          </div>
        </form>

      </div>
    </section>
  );
};
