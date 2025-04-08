// components/Marquee.tsx
'use client';

import { useEffect, useRef } from "react";
import { useMenu } from "../context/MenuContext";
import Link from "next/link";

export default function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { menuOpen } = useMenu();

  // React to menu open state if needed
  useEffect(() => {
    // Placeholder for menu-related effects
  }, [menuOpen]);

  return (
    <div
      id={menuOpen ? "menuActive" : ""}
      className={`menuWrapper ${menuOpen ? "menuWrapperActive" : ""}`}
    >
      <div className={`marquee ${menuOpen ? "menu-open" : ""}`} ref={marqueeRef}>
        <p><span className="marqueeTitle">TECHNOLOGY CONSULTING FIRM</span>Fractional business & technology strategy, design, and development.</p>
        <p><span className="marqueeTitle">WHERE</span>1301 Corlies Ave, Suite 2D, Asbury Park, NJ 07712</p>
        <p><span className="marqueeTitle">FOCUSES</span>Mobile Apps&nbsp;&nbsp;Websites&nbsp;&nbsp;Ecommerce&nbsp;&nbsp;Digital Systems</p>
        <p><span className="marqueeTitle">TECHNOLOGY CONSULTING FIRM</span>Fractional business & technology strategy, design, and development.</p>
        <p><span className="marqueeTitle">WHERE</span>1301 Corlies Ave, Suite 2D, Asbury Park, NJ 07712</p>
        <p><span className="marqueeTitle">FOCUSES</span>Mobile Apps&nbsp;&nbsp;Websites&nbsp;&nbsp;Ecommerce&nbsp;&nbsp;Digital Systems</p>
      </div>

      <div className="menu__navigation">
        <Link id="footerHome" className="footer__menuOption" href="/" target="_top">
          <span className="footer__menuOption__header">Home</span>
          <span className="footer__menuOption__subheader">
            Beat your high score<br />in our shooter.
          </span>
        </Link>

        <Link id="footerWork" className="footer__menuOption" href="/work" target="_top">
          <span className="footer__menuOption__header">Work</span>
          <span className="footer__menuOption__subheader">
            Flexible and scalable<br />projects and engagements.
          </span>
        </Link>

        <Link id="footerServices" className="footer__menuOption" href="/services" target="_top">
          <span className="footer__menuOption__header">Services</span>
          <span className="footer__menuOption__subheader">
            Impactful and creative work<br />driving business goals.
          </span>
        </Link>

        <Link id="footerAbout" className="footer__menuOption" href="/about" target="_top">
          <span className="footer__menuOption__header">About</span>
          <span className="footer__menuOption__subheader">
            Designing and developing<br />products and leadership.
          </span>
        </Link>

        <Link id="footerContact" className="footer__menuOption" href="/contact" target="_top">
          <span className="footer__menuOption__header">Contact</span>
          <span className="footer__menuOption__subheader">
            We’re excited to see<br />what comes next.
          </span>
        </Link>
      </div>
    </div>
  );
}