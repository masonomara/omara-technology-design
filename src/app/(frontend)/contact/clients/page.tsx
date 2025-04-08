import Link from 'next/link'
import React from 'react'
import styles from '../../../styles/subcontact.module.css'
import Image from 'next/image'

export default function ClientInquiries() {
  const emailAddress = 'contact@omaratechnologydesign.com'

  return (
    <div className="standardPageContainer">
      <Link className={styles.backWrapper} href="/contact" target="_top">
        <Image className={styles.backArrow} src="/redArrow.svg" height={120} width={120} alt="back" />
      </Link>
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Client Inquiries</h1>
        <p className={styles.subtitle}>
          O’Mara Technology & design is a technology consulting firm working in fractional or independent business and digital product strategy, design, and development roles.
          <br />
          Our focuses include mobile apps, websites, ecommerce, or any digital system. If you’re interested in any of these services or more, please fill out the form below.</p>
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
              <label className={styles.label} htmlFor="company">Company</label>
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

              {/* Leadership & Strategy Section */}
              <div className={styles.serviceCategory}>
                <h3>Leadership & Strategy</h3>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="fractionalBusinessLeadership" name="services" value="Fractional Business Leadership" />
                    <label htmlFor="fractionalBusinessLeadership">Fractional Business Leadership</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="fractionalTechnologyLeadership" name="services" value="Fractional Technology Leadership" />
                    <label htmlFor="fractionalTechnologyLeadership">Fractional Technology Leadership</label>
                  </div>
                </div>
              </div>

              {/* Design Section */}
              <div className={styles.serviceCategory}>
                <h3>Design</h3>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="appDesign" name="services" value="App Design" />
                    <label htmlFor="appDesign">App Design</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="websiteDesign" name="services" value="Website Design" />
                    <label htmlFor="websiteDesign">Website Design</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="eCommerceDesign" name="services" value="eCommerce Design" />
                    <label htmlFor="eCommerceDesign">eCommerce Design</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="brandIdentity" name="services" value="Brand Identity" />
                    <label htmlFor="brandIdentity">Brand Identity</label>
                  </div>
                </div>
              </div>

              {/* Development Section */}
              <div className={styles.serviceCategory}>
                <h3>Development</h3>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="appDevelopment" name="services" value="App Development" />
                    <label htmlFor="appDevelopment">App Development</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="websiteDevelopment" name="services" value="Website Development" />
                    <label htmlFor="websiteDevelopment">Website Development</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="eCommerceDevelopment" name="services" value="eCommerce Development" />
                    <label htmlFor="eCommerceDevelopment">eCommerce Development</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="digitalSystemDevelopment" name="services" value="Digital System Development" />
                    <label htmlFor="digitalSystemDevelopment">Digital System Development</label>
                  </div>
                </div>
              </div>

              {/* Other Section */}
              <div className={styles.serviceCategory}>
                <h3>Other</h3>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="customSolutions" name="services" value="Custom Solutions" />
                    <label htmlFor="customSolutions">Custom Solutions</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="auditsOptimization" name="services" value="Audits & Optimization" />
                    <label htmlFor="auditsOptimization">Audits & Optimization</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="productConsulting" name="services" value="Product Consulting" />
                    <label htmlFor="productConsulting">Product Consulting</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="additionalDetails">Any additional details you would like to share?</label>
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