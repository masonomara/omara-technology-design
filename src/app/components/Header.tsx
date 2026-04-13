import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "about", label: "About", href: "/about" },
  { id: "process", label: "Process", href: "/process" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__content--left">
          <Link href="/" className="header__logoWrapper">
            <Image
              className="header__logo--desktop"
              src="/longWordmark.svg"
              width={326}
              height={20.03}
              alt="Logo"
            />
            <Image
              className="header__logo--mobile"
              src="/top-logo-spacing.svg"
              width={326}
              height={51.03}
              alt="O'Mara Technology"
            />
          </Link>
          <div className="header__textContainer" />
        </div>
        <div className="header__content--right">
          <nav className="header__menuWrapper">
            {NAV_LINKS.map(({ id, label, href }) => (
              <Link key={id} id={id} className="header__menuOption" href={href}>
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
