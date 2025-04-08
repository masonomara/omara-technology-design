import Link from 'next/link'
import React from 'react'
import styles from '../../../styles/subcontact.module.css'

export default function ClientInquiries() {
  const emailAddress = 'contact@omaratechnologydesign.com'

  return (
    <div className="standardPageContainer">
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Client Inquiries</h1>
        <p className={styles.subtitle}>
          O'Mara Technology & design is a technology consulting firm working in fractional or independent business and digital product strategy, design, and development roles.
          <br />
          Our focuses include mobile apps, websites, ecommerce, or any digital system. If you're interested in any of these services or more, please fill out the form below.</p>
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

        <div className={styles.contactFormWrapper}>
          <form className={styles.contactForm}>
            <div className={styles.formField}>
              <label className={styles.label} htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder='Name*'
                required
              />
            </div>


            <div className={styles.formField}>
              <label className={styles.label} htmlFor="email">Company Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email*"
                required
              />
            </div>


            <div className={styles.formField}>
              <label className={styles.label} htmlFor="company">Company*</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder='Company'
                
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="currentUrl">Current URL</label>
              <input
                type="url"
                id="currentUrl"
                name="currentUrl"
                placeholder="Current URL"
              />
            </div>

            <div className={styles.formField}>
              <p>Please indicate which services you are interested in:</p>
              <div className={styles.checkboxGroup}>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="appDesign" name="services" value="App Design" />
                  <label htmlFor="appDesign">App Design</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="brandStrategy" name="services" value="Brand Strategy" />
                  <label htmlFor="brandStrategy">Brand Strategy</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="brandIdentity" name="services" value="Brand Identity" />
                  <label htmlFor="brandIdentity">Brand Identity</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="campaign" name="services" value="Campaign" />
                  <label htmlFor="campaign">Campaign</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="contentStrategy" name="services" value="Content Strategy" />
                  <label htmlFor="contentStrategy">Content Strategy</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="editorialDesign" name="services" value="Editorial Design" />
                  <label htmlFor="editorialDesign">Editorial Design</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="packagingDesign" name="services" value="Packaging Design" />
                  <label htmlFor="packagingDesign">Packaging Design</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="websiteDesign" name="services" value="Website Design" />
                  <label htmlFor="websiteDesign">Website Design</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="websiteDevelopment" name="services" value="Website Development" />
                  <label htmlFor="websiteDevelopment">Website Development</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input type="checkbox" id="other" name="services" value="Other" />
                  <label htmlFor="other">Other</label>
                </div>
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="additionalDetails">Anything specific you'd like to share? (optional)</label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                rows={4}
                className={styles.textareaInput}
                placeholder="Any additional details you would like to share?"
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}