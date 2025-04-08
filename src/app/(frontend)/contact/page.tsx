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

            <div className={styles.buttonHeading}>Let's Get Started</div>
            <div className={styles.buttonSubheading}>Work with O'Mara Technology & Design</div>


          </Link>

          <div className={styles.subButtonsWrapper}>
            <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.subButton}`}>
              Press Inquiries
            </Link>
            <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.subButton}`}>
              Join Our Team
            </Link>
            <Link href="mailto:contact@omaratechnologydesign.com" target="_blank" className={`${styles.buttonBorder} ${styles.subButton}`}>
              General Inquiries
            </Link>
          </div>
          <div className={styles.emailInfo}>
            Online forms aren't your thing? Feel free to email <Link className={styles.emailLink} href="mailto:contact@omaratechnologydesign.com" target="_blank">contact@omaratechnologydesign.com</Link>.
          </div>
        </div>



        <div className={styles.companyTitle}>
          O'Mara Technology & Design
        </div>
      </div>
    </div>
  )
}