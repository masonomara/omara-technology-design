// components/Marquee.tsx
'use client';

import { useEffect, useRef } from "react";

interface MarqueeProps {
  footerState?: any;
}

export default function Marquee({ footerState }: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  // Example of reacting to header state changes
  useEffect(() => {
    if (footerState?.activeSection) {
      // You could highlight the relevant section in the marquee
      // or adjust scrolling speed, etc.
      console.log("Marquee reacting to:", footerState.activeSection);
    }
  }, [footerState]);

  return (
    <div className={"wrapper"}>
      <div className={"marquee"} ref={marqueeRef}>
        <p><span className={"marqueeTitle"}>TECHNOLOGY CONSULTING FIRM</span>Fractional business & technology strategy, design, and development.</p>
        <p><span className={"marqueeTitle"}>WHERE</span> 1301 Corlies Ave Suite 2D, Asbury Park, NJ 07712</p>
        <p><span className={"marqueeTitle"}>FOCUSES</span>
          Mobile Apps    Websites
          Ecommerce    Digital Systems</p>
        <p><span className={"marqueeTitle"}>TECHNOLOGY CONSULTING FIRM</span>Fractional business & technology strategy, design, and development.</p>
        <p><span className={"marqueeTitle"}>WHERE</span> 1301 Corlies Ave Suite 2D, Asbury Park, NJ 07712</p>
        <p><span className={"marqueeTitle"}>FOCUSES</span>
          Mobile Apps    Websites
          Ecommerce    Digital Systems</p>
      </div>
    </div>
  );
}