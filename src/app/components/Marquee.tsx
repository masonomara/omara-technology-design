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
          <span>Beat your high score in our shooter, 
Vemara Solutions
Drive your business towards goals and new opportunities.

Access industry-leading technology strategy, design, and development for digital products and solutions.</span>
        </Link>
        <Link id={"footerWork"} className={"footer__menuOption"} href="/work" target="_top">
          <span>Work</span>
          <span>Creating intuitive, creative, and scalable solutions with industry-leading technology.

We have over 20 active clients with an average relationship of more than a year and a 96% retention rate.</span>

        </Link>
        <Link id={"footerServices"} className={"footer__menuOption"} href="/services" target="_top">
          <span>Services</span>
          <span>Working within a variety of business contexts for your needs. Proud to deliver a diverse range of services, solutions, technologies, and business contexts to meet our client‘s business needs. Flexible and scalable solutions.</span>

        </Link>
        <Link id={"footerAbout"} className={"footer__menuOption"} href="/about" target="_top">
          <span>About</span>
          <span>Working within a variety of business contexts for your needs. From digital products including mobile apps, websites, and custom software to technical solutions.

Our team drives businesses towards their goals and create new opportunities through our comprehensive services. </span>

        </Link>
        <Link id={"footerContact"} className={"footer__menuOption"} href="/contact" target="_top">
          <span>Contact</span>
          <span>We're excited to see what comes next.

We like to partner with businesses that are leading innovative initiatives and using industry-leading technology to drive their goals forward.</span>

        </Link>
      </div>
    </div>
  );
}