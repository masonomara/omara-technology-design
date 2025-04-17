import Image from "next/image";
import styles from "../../styles/about.module.css";
import Link from "next/link";
import FooterContact from "@/app/components/FooterContact";

export default async function Page() {
  const emailAddress = 'connect@omaratechnologydesign.com';

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">About</h1>
        <div className={styles.cardImageContainer}>
          <div className={styles.cardImageScreen} />
          <div className={styles.cardImageMultiply} />

          <div className={styles.cardImage}>
            <Image
              src="/siteOffice.png"
              alt="Photo of office interior"
              layout="fill"
              objectFit="cover"
              className={styles.cardImageTwo}
            />
          </div>

        </div>

        <p className={styles.header}>
          Strategy and Execution
        </p>
        <p className={styles.subtitle}>
          O’Mara Technology & Design provides strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools that connect them all. We lead projects from ideation to ongoing iterations, often in fractional roles or long-term partnerships. We build intuitive, user-centered products that drive business towards their goals.
        </p>
        <p className={styles.subtitle} >
          We prioritize open-minded problem-solving and tailor our process to each client’s goals, resources, and timeline. The end result is always the same: thoughtful, technically sound products that feel great to use and deliver real value for businesses and users.
        </p>
        <div className={styles.emailInfo}>
          Interested in working together?<br />
          EMAIL:{' '}
          <Link
            className={styles.emailLink}
            href={`mailto:${emailAddress}`}
            target="_blank"
          >
            masonomara.com
          </Link>
        </div>
        <div className={styles.cardImageContainer}>
          <div className={styles.cardImageScreen} />
          <div className={styles.cardImageMultiply} />

          <div className={styles.cardImage}>
            <Image
              src="/siteHeadshot.png"
              alt="Headshot of Mason O‘Mara"
              layout="fill"
              objectFit="cover"
              className={styles.cardImageTwo}
            />
          </div>

        </div>
        <p className={styles.header}>
          Fractional and Modular Roles
        </p>
        <p className={styles.subtitle}>
          We independently lead projects or work embedded alongside product teams and company leadership. Our team, led by Mason O’Mara, brings experience across digital strategy, design, and development, supported by specialists who contribute in specific areas. Our goal is to surround ourselves with good people, good ideas, and build things that last.
        </p>
        <div className={styles.emailInfo}>
          Visit Mason O‘Mara's Personal Site<br />
          URL:{' '}
          <Link
            className={styles.emailLink}
            href={`masonomara.com`}
            target="_blank"
          >
            masonomara.com
          </Link>
        </div>


        <FooterContact />
      </div>
    </main>
  );
}
