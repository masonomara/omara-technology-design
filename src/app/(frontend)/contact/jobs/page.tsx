import Link from 'next/link'
import React from 'react'
import styles from '../../../styles/subcontact.module.css'
import Image from 'next/image'

export default function JobInquiries() {
  const emailAddress = 'contact@omaratechnologydesign.com'

  return (
    <div className="standardPageContainer">
      <Link className={styles.backWrapper} href="/contact" target="_top">
        <Image className={styles.backArrow} src="/redArrow.svg" height={120} width={120} alt="back" />
      </Link>
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Job Inquiries</h1>
        <div className={styles.emailInfo}>
          Prefer email?{' '}
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
          We’re always looking for talented individuals to join our team of technology consultants and creative professionals. If you are interested, please fill out the form below.
          </p>
       

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


            <div className={styles.formField}>
              <label className={styles.label} htmlFor="portfolioUrl">Portfolio URL</label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                placeholder='Portfolio URL*'
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="portfolioUrl">Role</label>
              <input
                type="single"
                id="role"
                name="role"
                placeholder="Desired Role*"
                required
              />
            </div>


            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label className={styles.label} htmlFor="additionalDetails">Anything else you would like to share?</label>              <textarea
                id="additionalDetails"
                name="additionalDetails"
                rows={4}
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