import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import CursorFollower from "./../components/CursorFollower";
import './../globals.css'
import { Analytics } from "@vercel/analytics/react"
import { SanityLive } from "@/sanity/lib/live";
import Link from "next/link";
import { DisableDraftMode } from "../components/DisableDraftMode";
import { VisualEditing } from "next-sanity";



export const metadata: Metadata = {
  title: "O'Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>

      <CursorFollower /> {/* Add this component */}
      <header className={"header"}>
        <div className={"header__content"}>
          <div className={"header__content--left"}>
            <div className={"header__logoWrapper"}>
              <Image className={"header__logo--desktop"} src="/monogramText.svg" width={158} height={51} alt="Logo" />
              <Image className={"header__logo--mobile"} src="/monogramText.svg" width={140} height={45} alt="Logo" />
            </div>
            <div className={"header__textContainer"}>
              <div id={"textAbout"} className={"header__textWrapper"}>
                <div className={"header__textTitle"}>Technology Consulting Firm</div>
                <div className={"header__textBody"}>Fractional business & digital product</div>
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
                <div className={"header__textBody"}>Ecommerce&nbsp;&nbsp;&nbsp;&nbsp;Systems</div>
              </div>
            </div>
          </div>
          <div className={"header__content--right"}>
            <div className={"header__menuWrapper"}>
              <div id={"home"} className={"header__menuOption"}>
                <span>Home</span>
              </div>
              <div id={"menu"} className={"header__menuOption"}>
                <span>Menu</span>
              </div>
              <div id={"work"} className={"header__menuOption"}>
                <span>Work</span>
              </div>
              <Link id={"services"} className={"header__menuOption"} href="/services" target="_top">
                <span>Services</span>
              </Link>
              <div id={"about"} className={"header__menuOption"}>
                <span>About</span>
              </div>
              <div id={"contact"} className={"header__menuOption"}>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {children}
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Analytics />

      <div className={"wrapper"}>
        <div className={"marquee"}>
          <p><span className={"marqueeTitle"}>TECHNOLOGY CONSULTING FIRM</span>Fractional business & digital product strategy, design, and development.</p>
          <p><span className={"marqueeTitle"}>WHERE</span> 1301 Corlies Ave Suite 2D, Asbury Park, NJ 07712</p>
          <p><span className={"marqueeTitle"}>FOCUSES</span>
            Mobile Apps    Websites
            Ecommerce    Systems</p>
          <p><span className={"marqueeTitle"}>TECHNOLOGY CONSULTING FIRM</span>Fractional business & digital product strategy, design, and development.</p>
          <p><span className={"marqueeTitle"}>WHERE</span> 1301 Corlies Ave Suite 2D, Asbury Park, NJ 07712</p>
          <p><span className={"marqueeTitle"}>FOCUSES</span>
            Mobile Apps    Websites
            Ecommerce    Systems</p>
        </div>
      </div>

    </section >
  );
}
