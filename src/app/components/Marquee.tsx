// components/Marquee.tsx
"use client";

import { useRef } from "react";
import { useMenu } from "../context/MenuContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInButton } from "../lib/motion";

const menuItems = [
  { id: "footerHome", href: "/", title: "Home", subtitle: "Back to the start" },
  {
    id: "footerPortfolio",
    href: "/portfolio",
    title: "Portfolio",
    subtitle: "Our recent work",
  },
  {
    id: "footerServices",
    href: "/services",
    title: "Services",
    subtitle: "What we offer",
  },
  { id: "footerAbout", href: "/about", title: "About", subtitle: "Who we are" },
  {
    id: "footerContact",
    href: "/contact",
    title: "Contact",
    subtitle: "Get in touch",
  },
];

export default function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { menuOpen, setMenuOpen } = useMenu();
  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      id={menuOpen ? "menuActive" : ""}
      className={`menuWrapper ${menuOpen ? "menuWrapperActive" : ""} `}
    >
      <div
        className={`marquee ${menuOpen ? "menu-open" : ""}`}
        ref={marqueeRef}
      >
        <p>
          <span className="marqueeTitle">DIGITAL PRODUCT AGENCY</span>
          Product Design and Technical Development Strategy and Services
        </p>
        <p>
          <span className="marqueeTitle">WHERE</span>1301 Corlies Ave, Suite 2D,
          Asbury Park, NJ 07712
        </p>
        <p>
          <span className="marqueeTitle">FOCUSES</span>Mobile Apps, Websites,
          Software
        </p>
        <p>
          <span className="marqueeTitle">DIGITAL PRODUCT AGENCY</span>
          Product Design and Technical Development Strategy and Services
        </p>
        <p>
          <span className="marqueeTitle">WHERE</span>1301 Corlies Ave, Suite 2D,
          Asbury Park, NJ 07712
        </p>
        <p>
          <span className="marqueeTitle">FOCUSES</span>Mobile Apps, Websites,
          Software
        </p>
      </div>
      <div className="menu__navigation">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="footer__menuOptionWrapper"
            variants={fadeInButton("up", index * 0.03, 1.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
          >
            <Link
              id={item.id}
              className="footer__menuOption"
              href={item.href}
              onClick={closeMenu}
            >
              <span className="footer__menuOption__header">{item.title}</span>
              <Image src="/tanArrow.svg" alt="arrow" height={25} width={25} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
