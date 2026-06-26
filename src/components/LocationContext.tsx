import React, { createContext, useContext, useState } from "react";

export type LocationType = "Hebbal" | "Dr. Rajkumar Road" | "Kuvempunagar";

interface LocationContextType {
  activeLocation: LocationType;
  setActiveLocation: (loc: LocationType) => void;
  getLocationAssets: () => {
    palaceImages: string[];
    theaterImages: string[];
    accentColor: string;
    details: string;
  };
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLocation, setActiveLocation] = useState<LocationType>("Hebbal");

  const getLocationAssets = () => {
    switch (activeLocation) {
      case "Dr. Rajkumar Road":
        return {
          palaceImages: [
            "/assets/mysore_palace_day.png",
            "/assets/mysore_palace_dusk.png",
            "/assets/mysore_palace.png"
          ],
          theaterImages: [
            "/assets/asset-2.jpeg", // couple dome special
            "/assets/asset-10.jpeg",
            "/assets/asset-11.jpeg",
            "/assets/asset-12.jpeg"
          ],
          accentColor: "#d4af37",
          details: "📍 Location: DR RAJKUMAR ROAD | Midnight slots & custom surprise setups available."
        };
      case "Kuvempunagar":
        return {
          palaceImages: [
            "/assets/mysore_palace_dusk.png",
            "/assets/mysore_palace.png",
            "/assets/mysore_palace_day.png"
          ],
          theaterImages: [
            "/assets/asset-3.jpeg", // birthday special setup
            "/assets/asset-13.jpeg",
            "/assets/asset-14.jpeg",
            "/assets/asset-15.jpeg"
          ],
          accentColor: "#d4af37",
          details: "📍 Location: Kuvempunagar | Features premium VIP setups & couple seats."
        };
      case "Hebbal":
      default:
        return {
          palaceImages: [
            "/assets/mysore_palace.png",
            "/assets/mysore_palace_day.png",
            "/assets/mysore_palace_dusk.png"
          ],
          theaterImages: [
            "/assets/asset-1.jpeg", // standard dolby special
            "/assets/asset-7.jpeg",
            "/assets/asset-8.jpeg",
            "/assets/asset-9.jpeg"
          ],
          accentColor: "#d4af37",
          details: "📍 Location: 1 Abhishek Circle HEBBAL | Features state-of-the-art Dolby Atmos screen."
        };
    }
  };

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocation, getLocationAssets }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
