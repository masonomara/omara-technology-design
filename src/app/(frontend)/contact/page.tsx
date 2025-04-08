import Link from 'next/link'
import React from 'react'
import styles from '../../styles/contact.module.css'

export default function Contacts() {
  return (
    <div className="standardPageContainer">
      <div className={styles.contactWrapper}>


        <h1 className={styles.title}>Contact</h1>
        <div className={styles.buttonsWrapper}>


          <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.mainButton}`}>
            <div className={styles.buttonHeading}>FOR OPPORTUNITIES TO WORK WITH O.T.D<br />PLEASE click here</div>
            {/* <div className={styles.buttonSubheading}>PLEASE CLICK HERE</div> */}
          </Link>

          <div className={styles.subButtonsWrapper}>
            <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.subButton}`}>
              For Press Inquiries<br />
              CLICK HERE
            </Link>
            <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.subButton}`}>
              FOR JOB INQUIRIES<br />
              CLICK HERE
            </Link>
            <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.subButton}`}>
              FOR GENERAL INQUIRIES<br />
              CLICK HERE
            </Link>
          </div>
          <div className={styles.emailInfo}>
            COntact forms not your thing? Feel free to email <Link className={styles.emailLink} href="mailto:contact@omaratechnologydesign.com" target="_blank">contact@omaratechnologydesign.com</Link>
          </div>
        </div>



        <div className={styles.companyTitle}>
          O’Mara Technology & Design
        </div>
      </div>
    </div>
  )
}