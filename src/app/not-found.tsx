import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import styles from "./not-found.module.css";

export default function NotFound() {
  const emailAddress = "info@omaratechnology.com";

  return (
    <>
      <Header />
      <div className="standardPageContainer">
        <div className={styles.contactWrapper}>
          <h1 className={styles.title}>404 Not Found</h1>

          <div className={styles.buttonsWrapper}>
            <Link
              href={`/contact/clients`}
              target="_top"
              className={`${styles.buttonBorder} ${styles.mainButton}`}
            >
              <div className={styles.buttonHeading}>
                FOR OPPORTUNITIES TO WORK WITH O.T.D.
                <br />
                PLEASE CLICK HERE
              </div>
            </Link>

            <div className={styles.subButtonsWrapper}>
              <Link
                href={`/contact/press`}
                target="_top"
                className={`${styles.buttonBorder} ${styles.subButton}`}
              >
                For Press Inquiries
                <br />
                CLICK HERE
              </Link>

              <Link
                href={`/contact/jobs`}
                target="_top"
                className={`${styles.buttonBorder} ${styles.subButton}`}
              >
                FOR JOB INQUIRIES
                <br />
                CLICK HERE
              </Link>

              <Link
                href={`/contact/general`}
                target="_top"
                className={`${styles.buttonBorder} ${styles.subButton}`}
              >
                FOR GENERAL INQUIRIES
                <br />
                CLICK HERE
              </Link>
            </div>

            <div className={styles.emailInfo}>
              Prefer email?{" "}
              <a className={styles.emailLink} href={`mailto:${emailAddress}`}>
                {emailAddress}
              </a>
            </div>
          </div>

          <div className={styles.companyTitle}>
            {/* O’Mara Technology */}
            <Image
              src="/longWordmark.svg"
              width={326}
              height={20.03}
              alt="O’Mara Technology"
              className={styles.companyTitleImage}
            />
            <Image
              src="/condensedWordmark.svg"
              width={326}
              height={20.03}
              alt="O’Mara Technology"
              className={styles.companyTitleImageCondensed}
            />
            <Image
              src="/superCondensedWordmark.svg"
              height={24}
              width={94}
              alt="O’Mara Technology"
              className={styles.companyTitleImageSuperCondensed}
            />
          </div>
        </div>
      </div>
    </>
  );
}
