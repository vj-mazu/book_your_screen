import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Quote } from "lucide-react";

interface Review {
  name: string;
  text: string;
  rating: number;
  source: string;
  timeAgo: string;
}

const reviewsList: Review[] = [
  {
    name: "Priya Sharma",
    text: "I had my daughter's 1st birthday here and it was amazing!!! Lots of enjoyment... The decoration was nice, good ambience and top notch. Kids had a great time. I'm so glad, would recommend it to anyone.",
    rating: 5,
    source: "Google Review",
    timeAgo: "2 months ago",
  },
  {
    name: "Monika R",
    text: "We had a wonderful time at the private theatre with our family and friends. The space was clean, cozy, and well-equipped with great sound and visuals. Perfect for small private screenings!",
    rating: 5,
    source: "Local Guide",
    timeAgo: "1 month ago",
  },
  {
    name: "Rahul K",
    text: "Often, there's a party vibe with balloons, lights, and a dance floor. A perfect spot for intimate gatherings. The Dolby Atmos sound is absolutely incredible for a private setup.",
    rating: 5,
    source: "Google Review",
    timeAgo: "3 weeks ago",
  },
  {
    name: "Sneha Patil",
    text: "Celebrated our anniversary here — surprise decoration was beautiful! The 4K screen quality is theatre-grade. Staff was very cooperative and the outside food policy is a huge plus.",
    rating: 5,
    source: "Google Review",
    timeAgo: "1 week ago",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-20 md:py-40 px-6 sm:px-8 md:px-12 lg:px-24 bg-bg border-t border-stroke/40">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "auto" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-6 overflow-hidden"
          >
            <div className="w-12 h-[1px] bg-accent" />
            <span className="text-accent font-sans text-[10px] uppercase tracking-[5px] whitespace-nowrap font-bold">
              Voice of our guests
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-8xl font-display text-text-primary italic font-bold"
              >
                Reviews
              </motion.h2>
            </div>

            {/* Google Rating Details Badge - Gold Plated Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 bg-gradient-to-r from-[#fffbf0] via-[#ffffff] to-[#fffbf0] p-4 rounded-2xl border border-[#d4af37]/40 shadow-md shadow-[#d4af37]/5"
            >
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-3xl md:text-4xl font-display text-text-primary italic font-black bg-gradient-to-b from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent">
                    5.0
                  </span>
                  <Star size={22} className="text-[#d4af37] fill-[#d4af37]" />
                </div>
                <span className="text-muted font-sans text-[9px] uppercase tracking-[2px] mt-1 font-bold">
                  on Google Maps
                </span>
              </div>
              <a
                href="https://maps.app.goo.gl/t7BCXJCb87FTS3sJA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#aa7c11] hover:text-[#d4af37] transition-colors p-2 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/25"
              >
                <MapPin size={20} />
              </a>
            </motion.div>
          </div>
        </div>
 
        {/* Reviews List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-2">
          {reviewsList.map((review, idx) => {
            const isFeatured = review.name === "Sneha Patil";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={`relative flex flex-col p-6 sm:p-8 md:p-10 rounded-2xl bg-surface border transition-all duration-500 group ${
                  isFeatured 
                    ? "border-[#d4af37] bg-gradient-to-b from-[#fffbf0]/80 via-[#ffffff] to-[#fffbf0]/80 shadow-[0_15px_40px_rgba(212,175,55,0.08)] ring-1 ring-[#d4af37]/20" 
                    : "border-stroke hover:shadow-lg"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-6 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white font-sans text-[8px] font-black uppercase tracking-[2px] px-3.5 py-1 rounded-full shadow-md">
                    Featured Review
                  </span>
                )}
                
                <Quote
                  size={40}
                  className="text-accent/[0.08] absolute top-6 right-6 group-hover:text-accent/[0.12] transition-colors duration-500"
                />
                
                {/* Star line */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? "text-[#d4af37] fill-[#d4af37]" : "text-stroke/50"}
                    />
                  ))}
                </div>
 
                <p className="text-text-primary/80 font-sans text-xs sm:text-sm md:text-base leading-relaxed mt-6 mb-8 flex-grow relative z-10 font-bold italic">
                  "{review.text}"
                </p>
 
                {/* Reviewer Details */}
                <div className="flex justify-between items-center border-t border-stroke/50 pt-6">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary">{review.name}</h4>
                    <span className="text-[9px] text-muted uppercase tracking-[2px] font-bold block mt-1">
                      {review.source}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted/60 font-bold">{review.timeAgo}</span>
                </div>
 
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
