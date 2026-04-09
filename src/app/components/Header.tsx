// components/Header.tsx
"use client";

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
          <Link href="/" className={"header__logoWrapper"}>
            <Image
              className={"header__logo--desktop"}
              src="/monogramText.svg"
              width={158}
              height={51}
              alt="Logo"
            />
            <Image
              className={"header__logo--mobile"}
              src="/top-logo.svg"
              width={326}
              height={51.03}
              alt="O'Mara Technology"
            />
          </Link>
          <div className={"header__textContainer"}>
            {/* <div id={"textAbout"} className={"header__textWrapper"}>
              <div className={"header__textTitle"}>Digital Product Agency</div>

              <div className={"header__textBody"}>
                Product design and technical
              </div>
              <div className={"header__textBody"}>
                development strategy and services
              </div>
            </div> */}
            {/* <div id={"textWhere"} className={"header__textWrapper"}>
              <div className={"header__textTitle"}>Where</div>
              <div className={"header__textBody"}>
                1301 Corlies Ave Suite 2D,
              </div>
              <div className={"header__textBody"}>Asbury Park, NJ 07712</div>
            </div> */}
            {/* <div id={"textFocuses"} className={"header__textWrapper"}>
              <div className={"header__textTitle"}>Focuses</div>
              <div className={"header__textBody"}>
                Mobile Apps&nbsp;&nbsp;&nbsp;Websites
              </div>
              <div className={"header__textBody"}>Software</div>
            </div> */}
          </div>
        </div>
        <div className={"header__content--right"}>
          <div className={"header__menuWrapper"}>
            <Link id={"work"} className={"header__menuOption"} href="/work">
              <span>Work</span>
            </Link>
            <Link id={"about"} className={"header__menuOption"} href="/about">
              <span>About</span>
            </Link>
            <Link
              id={"process"}
              className={"header__menuOption"}
              href="/process"
            >
              <span>Process</span>
            </Link>

            <Link
              id={"contact"}
              className={"header__menuOption"}
              href="/contact"
            >
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
