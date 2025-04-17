// components/Marquee.tsx
'use client';

import { useRef } from "react";
import { useMenu } from "../context/MenuContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInButton } from "../lib/motion";

export default function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { menuOpen } = useMenu();

  return (
    <div
      id={menuOpen ? "menuActive" : ""}
      className={`menuWrapper ${menuOpen ? "menuWrapperActive" : ""} `}
    >
      <div className={`marquee ${menuOpen ? "menu-open" : ""}`} ref={marqueeRef}>
        <p><span className="marqueeTitle">TECHNOLOGY CONSULTING FIRM</span>Fractional business & technology strategy, design, and development.</p>
        <p><span className="marqueeTitle">WHERE</span>1301 Corlies Ave, Suite 2D, Asbury Park, NJ 07712</p>
        <p><span className="marqueeTitle">FOCUSES</span>Mobile Apps&nbsp;&nbsp;Websites&nbsp;&nbsp;Ecommerce&nbsp;&nbsp;Softwares</p>
        <p><span className="marqueeTitle">TECHNOLOGY CONSULTING FIRM</span>Fractional business & technology strategy, design, and development.</p>
        <p><span className="marqueeTitle">WHERE</span>1301 Corlies Ave, Suite 2D, Asbury Park, NJ 07712</p>
        <p><span className="marqueeTitle">FOCUSES</span>Mobile Apps&nbsp;&nbsp;Websites&nbsp;&nbsp;Ecommerce&nbsp;&nbsp;Softwares</p>
      </div>
      <div className="menu__navigation">
        <motion.div className="footer__menuOptionWrapper" variants={fadeInButton("up", "spring", .0, 1.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link id="footerHome" className="footer__menuOption" href="/" target="_top">
            <span className="footer__menuOption__header">Home</span>
            <Image src="/tanArrow.svg" alt="arrow" height={25} width={25} />
          </Link>
        </motion.div>
        <motion.div className="footer__menuOptionWrapper" variants={fadeInButton("up", "spring", .05, 1.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link id="footerPortfolio" className="footer__menuOption" href="/portfolio" target="_top">
            <span className="footer__menuOption__header">Portfolio</span>
            <Image src="/tanArrow.svg" alt="arrow" height={25} width={25} />
          </Link>
        </motion.div>
        <motion.div className="footer__menuOptionWrapper" variants={fadeInButton("up", "spring", .1, 1.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link id="footerServices" className="footer__menuOption" href="/services" target="_top">
            <span className="footer__menuOption__header">Services</span>
            <Image src="/tanArrow.svg" alt="arrow" height={25} width={25} />
          </Link>
        </motion.div>
        <motion.div className="footer__menuOptionWrapper" variants={fadeInButton("up", "spring", .15, 1.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link id="footerAbout" className="footer__menuOption" href="/about" target="_top">
            <span className="footer__menuOption__header">About</span>
            <Image src="/tanArrow.svg" alt="arrow" height={25} width={25} />
          </Link>
        </motion.div>
        <motion.div className="footer__menuOptionWrapper" variants={fadeInButton("up", "spring", .2, 1.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link id="footerContact" className="footer__menuOption" href="/contact" target="_top">
            <span className="footer__menuOption__header">Contact</span>
            <Image src="/tanArrow.svg" alt="arrow" height={25} width={25} />
          </Link>
        </motion.div>
      </div>
    </div >

  );
}