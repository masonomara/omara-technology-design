import Link from 'next/link'
import React from 'react'
import styles from '../../../styles/contact.module.css'

export default function ClientInquiries() {
  const emailAddress = 'contact@omaratechnologydesign.com'

  return (
    <div className="standardPageContainer">
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Client Inquiries</h1>
        <div className={styles.emailInfo}>
          Online forms not your thing? Feel free to email{' '}
          <Link
            className={styles.emailLink}
            href={`mailto:${emailAddress}`}
            target="_blank"
          >
            {emailAddress}
          </Link>
        </div>

        <div className={styles.buttonsWrapper}>
          <Link
            href={`/contact/work`}
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
              href={`/contact/work`}
              target="_top"
              className={`${styles.buttonBorder} ${styles.subButton}`}
            >
              For Press Inquiries
              <br />
              CLICK HERE
            </Link>

            <Link
              href={`mailto:${emailAddress}`}
              target="_blank"
              className={`${styles.buttonBorder} ${styles.subButton}`}
            >
              FOR JOB INQUIRIES
              <br />
              CLICK HERE
            </Link>

            <Link
              href={`mailto:${emailAddress}`}
              target="_blank"
              className={`${styles.buttonBorder} ${styles.subButton}`}
            >
              FOR GENERAL INQUIRIES
              <br />
              CLICK HERE
            </Link>
          </div>


        </div>


      </div>
    </div>
  )
}