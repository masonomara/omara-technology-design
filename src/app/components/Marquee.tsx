// components/Marquee.tsx
'use client';

import { useEffect, useRef } from "react";
import { useMenu } from "../context/MenuContext";
import Link from "next/link";

export default function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { menuOpen } = useMenu();

  // Example of reacting to header state changes
  useEffect(() => {
    // React to menu open state

  }, [menuOpen]);

  return (
    <div id={`${menuOpen ? "menuActive" : ""}`} className={`menuWrapper ${menuOpen ? "menuWrapperActive" : ""}`}>
      <div className={`marquee ${menuOpen ? 'menu-open' : ''}`} ref={marqueeRef}>
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
      <div className="menu__navigation">
        <Link id={"footerHome"} className={"footer__menuOption"} href="/" target="_top">
          <span>Home</span>
        </Link>
        <Link id={"footerWork"} className={"footer__menuOption"} href="/work" target="_top">
          <span>Work</span>
        </Link>
        <Link id={"footerServices"} className={"footer__menuOption"} href="/services" target="_top">
          <span>Services</span>
        </Link>
        <Link id={"footerAbout"} className={"footer__menuOption"} href="/about" target="_top">
          <span>About</span>
        </Link>
        <Link id={"footerContact"} className={"footer__menuOption"} href="/contact" target="_top">
          <span>Contact</span>
        </Link>
      </div>
    </div>
  );
}