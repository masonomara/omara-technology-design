import Link from 'next/link'
import React from 'react'
import styles from '../../../styles/contact.module.css'
import Image from 'next/image'

export default function PressInquiries() {
  const emailAddress = 'contact@omaratechnologydesign.com'

  return (
    <div className="standardPageContainer">
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Press Inquiries</h1>

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
        </div>

        <div className={styles.companyTitle}>
          {/* O'Mara Technology & Design */}
          <Image src="/longWordmark.svg" height={12} width={208} alt="O’Mara Technology & Design" className={styles.companyTitleImage} />
          <Image src="/condensedWordmark.svg" height={24} width={142} alt="O’Mara Technology & Design" className={styles.companyTitleImageCondensed} />
          <Image src="/superCondensedWordmark.svg" height={36} width={87} alt="O’Mara Technology & Design" className={styles.companyTitleImageSuperCondensed} />
        </div>
      </div>
    </div>
  )
}