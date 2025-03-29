import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import Image from "next/image";
import CursorFollower from "./components/CursorFollower";
import './global.css'
import { Analytics } from "@vercel/analytics/react"


const overpass = Overpass({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-overpass',
});

export const metadata: Metadata = {
  title: "O'Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: "0px", backgroundColor: "#EDE1CC" }}>
      <head><meta name="apple-mobile-web-app-title" content="O'Mara" />

      </head>
      <body className={` ${overpass.variable}`} style={{ margin: "0px", cursor: "none", position: "relative" }}>
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
                  <div className={"header__textBody"}>Engaging and intuitive digital product</div>
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
                  <div className={"header__textBody"}>Ecommerce&nbsp;&nbsp;&nbsp;&nbsp;Software</div>
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
                <div id={"services"} className={"header__menuOption"}>
                  <span>Services</span>
                </div>
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
        <Analytics />

        <div className={"wrapper"}>
          <div className={"marquee"}>
            <p><span className={"marqueeTitle"}>TECHNOLOGY CONSULTING FIRM</span> Engaging and intuitive digital product strategy, design, and development.</p>
            <p><span className={"marqueeTitle"}>WHERE</span> 1301 Corlies Ave Suite 2D, Asbury Park, NJ 07712</p>
            <p><span className={"marqueeTitle"}>FOCUSES</span>
              Mobile Apps    Websites
              Ecommerce    Software</p>
            <p><span className={"marqueeTitle"}>TECHNOLOGY CONSULTING FIRM</span> Engaging and intuitive digital product strategy, design, and development.</p>
            <p><span className={"marqueeTitle"}>WHERE</span> 1301 Corlies Ave Suite 2D, Asbury Park, NJ 07712</p>
            <p><span className={"marqueeTitle"}>FOCUSES</span>
              Mobile Apps    Websites
              Ecommerce    Software</p>
          </div>
        </div>
      </body>
    </html >
  );
}
