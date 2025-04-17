import Link from 'next/link'
import React from 'react'
import styles from '../styles/footer.module.css'
import Image from 'next/image'

export default function FooterContact() {

  return (

    <div className={styles.contactWrapper}>
      <div className="companyTitle">
        <Image
          src="/longWordmark.svg"
          height={12}
          width={208}
          alt="O'Mara Technology & Design"
          className="companyTitleImage"
        />
        <Image
          src="/condensedWordmark.svg"
          height={24}
          width={142}
          alt="O'Mara Technology & Design"
          className="companyTitleImageCondensed"
        />
        <Image
          src="/superCondensedWordmark.svg"
          height={36}
          width={87}
          alt="O'Mara Technology & Design"
          className="companyTitleImageSuperCondensed"
        />
      </div>
      <div className={styles.subButtonsWrapper}>

        <Link
          href={`/`}
          target="_top"
          className={styles.subButton}
        >
          HOME
        </Link>
        <Link
          href={`/portfolio`}
          target="_top"
          className={styles.subButton}
        >
          PORTFOLIO
        </Link>
        <Link
          href={`/services`}
          target="_top"
          className={styles.subButton}
        >
          SERVICES
        </Link>
        <Link
          href={`/about`}
          target="_top"
          className={styles.subButton}
        >
          ABOUT
        </Link>
        <Link
          href={`/contact`}
          target="_top"
          className={styles.subButton}
        >
          CONTACT
        </Link>

      </div>
      {/* <div className={styles.emailInfo}>
        Always feel free to email{' '}
        <Link
          className={styles.emailLink}
          href={`mailto:${emailAddress}`}
          target="_blank"
        >
          {emailAddress}
        </Link>
      </div> */}
    </div>
  )
}