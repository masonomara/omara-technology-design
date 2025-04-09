// components/Header.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useMenu } from "../context/MenuContext";

export default function Header() {
  const { menuOpen, setMenuOpen } = useMenu();

  // Toggle menu and update state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={"header"}>
      <div className={"header__content"}>
        <div className={"header__content--left"}>
          <Link href="/" target="_top" className={"header__logoWrapper"}>
            <Image className={"header__logo--desktop"} src="/monogramText.svg" width={158} height={51} alt="Logo" />
            <Image className={"header__logo--mobile"} src="/monogramText.svg" width={140} height={45} alt="Logo" />
          </Link>
          <div className={"header__textContainer"}>
            <div id={"textAbout"} className={"header__textWrapper"}>
              <div className={"header__textTitle"}>Technology Consulting Firm</div>
              <div className={"header__textBody"}>Fractional business & technology</div>
              <div className={"header__textBody"}>strategy, design, and development.</div>
            </div>
            <div id={"textWhere"} className={"header__textWrapper"}>
              <div className={"header__textTitle"}>Where</div>
              <div className={"header__textBody"}>1301 Corlies Ave Suite 2D,</div>
              <div className={"header__textBody"}>Asbury Park, NJ 07712</div>
            </div>
            <div id={"textFocuses"} className={"header__textWrapper"}>
              <div className={"header__textTitle"}>Focuses</div>
              <div className={"header__textBody"}>Mobile Apps&nbsp;&nbsp;&nbsp;&nbsp;Websites</div>
              <div className={"header__textBody"}>Ecommerce&nbsp;&nbsp;&nbsp;&nbsp;Digital Systems</div>
            </div>
          </div>
        </div>
        <div className={"header__content--right"}>
          <div className={"header__menuWrapper"}>
            <Link id={"home"} className={"header__menuOption"} href="/" target="_top">
              <span>Home</span>
            </Link>
            <div
              id={"menu"}
              className={`header__menuOption ${menuOpen ? "header__menuOptionActive" : ""}`}
              onClick={() => {
                toggleMenu();
              }}
            >
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </div>
            <Link id={"portfolio"} className={"header__menuOption"} href="/portfolio" target="_top">
              <span>Portfolio</span>
            </Link>
            <Link id={"services"} className={"header__menuOption"} href="/services" target="_top">
              <span>Services</span>
            </Link>
            <Link id={"about"} className={"header__menuOption"} href="/about" target="_top">
              <span>About</span>
            </Link>
            <Link id={"contact"} className={"header__menuOption"} href="/contact" target="_top">
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}