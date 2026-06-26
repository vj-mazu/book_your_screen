import { Send, MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-bg text-text-primary py-20 md:py-32 px-6 sm:px-8 md:px-12 lg:px-24 border-t border-stroke/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
        
        {/* Column 1: Brand & Desc */}
        <div className="col-span-1 sm:col-span-2">
          <h2 className="text-3xl md:text-4xl font-display italic font-black mb-6 tracking-tighter uppercase text-text-primary cursor-pointer" onClick={handleScrollToTop}>
            BOOK YOUR SCREEN <span className="text-accent font-sans not-italic text-sm font-bold tracking-[3px] ml-1">MYSURU</span>
          </h2>
          <p className="text-muted max-w-sm mb-8 font-sans text-xs uppercase tracking-widest leading-loose font-medium">
            Experience movies in absolute privacy with 150-inch 4K projection screens and surround sound systems. Mysuru's most exclusive venue for birthday parties and anniversaries.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-6">
            <a
              href="https://wa.me/919019333970"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              <Send size={20} />
            </a>
            <a
              href="https://maps.app.goo.gl/t7BCXJCb87FTS3sJA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              <MapPin size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Contact Address */}
        <div className="flex flex-col gap-6 md:gap-8">
          <h4 className="text-[10px] font-sans font-bold uppercase tracking-[5px] text-accent">
            Contact
          </h4>
          <ul className="space-y-4 md:space-y-6">
            <li className="flex items-start gap-3 text-muted">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <a
                href="https://maps.app.goo.gl/t7BCXJCb87FTS3sJA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-sans uppercase tracking-widest leading-relaxed hover:text-text-primary transition-colors font-medium"
              >
                1st Floor, Near Vijayanagar Main Road, <br />
                Opposite Club, <br />
                Mysuru, Karnataka 570017
              </a>
            </li>
            <li className="flex items-center gap-3 text-muted">
              <Phone size={18} className="text-accent shrink-0" />
              <a
                href="tel:+919019333970"
                className="text-xs font-sans uppercase tracking-widest hover:text-text-primary transition-colors font-medium"
              >
                +91 90193 33970
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Hours & Quick Links */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div>
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-[5px] text-accent mb-4">
              Hours
            </h4>
            <div className="flex items-center gap-3 text-muted">
              <Clock size={18} className="text-accent shrink-0" />
              <span className="text-xs font-sans uppercase tracking-widest font-medium">
                Daily: 10:00 AM - 11:30 PM
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-[5px] text-accent mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { id: "services", label: "Services" },
                { id: "pricing", label: "Pricing" },
                { id: "gallery", label: "Gallery" },
                { id: "reviews", label: "Reviews" },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-muted hover:text-text-primary text-xs font-sans uppercase tracking-widest transition-colors font-bold flex items-center gap-1 w-fit"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 md:mt-32 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/50 uppercase tracking-[4px] font-bold">
        <p>© {new Date().getFullYear()} Book Your Screen.</p>
        <p className="flex items-center gap-2">
          <span>Private Theater & Event Venue</span>
          <span>•</span>
          <a href="/admin" className="hover:text-[#d4af37] transition-colors flex items-center gap-0.5 lowercase font-bold tracking-widest text-[9px] border border-white/20 rounded px-2 py-0.5">
            <span>admin portal</span>
            <ArrowUpRight size={8} />
          </a>
        </p>
      </div>
    </footer>
  );
};
