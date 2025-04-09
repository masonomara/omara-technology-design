import Link from 'next/link'
import React from 'react'
import styles from '../../../styles/subcontact.module.css'
import Image from 'next/image'

export default function PressInquiries() {
  const emailAddress = 'contact@omaratechnologydesign.com'

  return (
    <div className="standardPageContainer">
      <Link className={styles.backWrapper} href="/contact" target="_top">
        <Image className={styles.backArrow} src="/redArrow.svg" height={120} width={120} alt="back" />
      </Link>
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Press Inquiries</h1>
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
        <p className={styles.subtitle}>
          O’Mara Technology & Design is a technology consulting firm working in fractional and independent business and digital product strategy, design, and development roles.
        </p>
        <p className={styles.subtitle}>
          For media resources, speaking engagements, interviews, or article requests, please fill out the form below.</p>


        <div className={styles.contactFormWrapper}>
          <form className={styles.contactForm}>
            <div className={styles.formField}>
              <label className={styles.label} htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name*"
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email*"
                required
              />
            </div>

            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label className={styles.label} htmlFor="additionalDetails">Any additional details you would like to share?</label>              <textarea
                id="additionalDetails"
                name="additionalDetails"
                rows={4}
                required
                placeholder="Any additional details you would like to share?"
                className={styles.textareaInput}
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}