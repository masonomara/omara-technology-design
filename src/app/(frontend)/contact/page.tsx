"use client"

import Link from 'next/link'
import React from 'react'
import styles from '../../styles/contact.module.css'
import { sendMail } from '@/app/lib/send-mail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FooterContact from '@/app/components/FooterContact'
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from '../../lib/motion';
import { BreadcrumbJsonLd, OrganizationJsonLd } from "next-seo";

// export const metadata: Metadata = {
//   title: "Contact | O‘Mara Technology & Design",
//   description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
//   alternates: {
//     canonical: "https://omaratechnologydesign.com/contact",
//   },
//   openGraph: {
//     title: "Contact | O'Mara Technology & Design",
//     description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
//     url: "https://omaratechnologydesign.com/contact",
//     siteName: "O‘Mara Technology & Design",
//     images: [
//       {
//         url: "https://omaratechnologydesign.com/bizCard.png",
//         width: 1200,
//         height: 686,
//         alt: "O‘Mara Technology & Design",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z.string().optional(),
  currentUrl: z.string().optional(),
  services: z.array(z.string()).optional(),
  inquiryType: z.enum(['job', 'press', 'general']).optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const emailAddress = 'connect@omaratechnologydesign.com';

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      currentUrl: '',
      message: '',
    }
  });

  const onSubmit = async (values: FormData) => {
    try {
      // Format selected services
      const selectedServices = values.services?.join(', ') || 'None selected';

      // Format email body
      const mailText = `
Name: ${values.name}
Email: ${values.email}
Company: ${values.company || 'N/A'}
Current URL: ${values.currentUrl || 'N/A'}
Inquiry Type: ${values.inquiryType || 'N/A'}
Services Interested In: ${selectedServices}

Message:
${values.message || 'No message provided.'}`
        ;

      const response = await sendMail({
        email: values.email,
        subject: `New Contact Form: ${values.inquiryType || 'General'} Inquiry`,
        text: mailText,
      });

      if (response?.messageId) {
        alert('Your message has been sent successfully. We will get back to you soon.');
        reset();
      } else {
        alert('Failed to send your message. Please try again or contact us directly.');
      }
    } catch (error) {
      alert('An error occurred. Please try again or contact us directly.');
      console.error(error);
    }
  };

  return (
    <>
      <OrganizationJsonLd
        type="ProfessionalService"
        name="O‘Mara Technology & Design"
        url="https://omaratechnologydesign.com"
        logo="https://omaratechnologydesign.com/monogramText.svg"
        email="connect@omaratechnologydesign.com"
        founder={{
          "@type": "Person",
          name: "Mason O‘Mara",
          sameAs: "https://masonomara.com",
        }}
        description="Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools."
        images={["https://omaratechnologydesign.com/bizCard.png"]}
        serviceType={[
          "Strategy",
          "Design",
          "Development",
          "Fractional Business Leadership",
          "Digital Systems",
          "Custom Solutions",
          "Audits & Optimization",
          "Product Consulting",
          "Fractional Technology Leadership",
          "App Design",
          "Website Design",
          "Ecommerce Design",
          "Brand Identity",
          "App Development",
          "Website Development",
          "Ecommerce Development",
        ]}
        hasOfferCatalog={{
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Fractional Business Leadership",
                url: "https://omaratechnologydesign.com/services/fractional-business-leadership",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Digital Systems",
                url: "https://omaratechnologydesign.com/services/digital-systems",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Custom Solutions",
                url: "https://omaratechnologydesign.com/services/custom-solutions",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Audits & Optimization",
                url: "https://omaratechnologydesign.com/services/audits-and-optimization",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Product Consulting",
                url: "https://omaratechnologydesign.com/services/product-consulting",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Fractional Technology Leadership",
                url: "https://omaratechnologydesign.com/services/fractional-technology-leadership",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "App Design",
                url: "https://omaratechnologydesign.com/services/app-design",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Website Design",
                url: "https://omaratechnologydesign.com/services/website-design",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Ecommerce Design",
                url: "https://omaratechnologydesign.com/services/ecommerce-design",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Brand Identity",
                url: "https://omaratechnologydesign.com/services/brand-identity",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "App Development",
                url: "https://omaratechnologydesign.com/services/app-development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Website Development",
                url: "https://omaratechnologydesign.com/services/website-development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Ecommerce Development",
                url: "https://omaratechnologydesign.com/services/ecommerce-development",
              },
            },
          ],
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://omaratechnologydesign.com",
          },
          {
            position: 2,
            name: "Contact",
            item: "https://omaratechnologydesign.com/contact",
          },
        ]}
      />
      <main className="standardPageContainer">
        <div className="standardPageWrapper">
          <motion.h1 variants={textFadeUp("up", "spring", .1, 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }} className="title">Contact</motion.h1>
          <motion.div className={styles.emailInfo}
            variants={fadeInButton("up", "spring", .3, 1.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}>
            Online forms not your thing?<br />
            Email:{' '}
            <Link
              className={styles.emailLink}
              href={`mailto:${emailAddress}`}
              target="_blank"
            >
              {emailAddress}
            </Link>
          </motion.div>
          <motion.div
            variants={textFadeUpSmall("up", "spring", .4, .8)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}>
            <p className={styles.subtitle}>
              O’Mara Technology & Design is a technology consulting firm working in fractional and independent business and digital product strategy, design, and development roles.
            </p>
            <p className={styles.subtitle} style={{ marginBottom: "2.4em" }}>
              Our focuses include mobile apps, websites, ecommerce, or any custom software. If you’re interested in any of these services or more, please fill out the form below.
            </p>
          </motion.div>
          <motion.div className={styles.contactFormWrapper} variants={fadeInButton("up", "spring", .6, 1.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}>
            <form className={styles.contactForm} onSubmit={handleSubmit(onSubmit)}>
              <p className={styles.formDivider} style={{ marginTop: "0em!important" }}>Your info</p>
              <div className={styles.formField}>

                <label className={styles.label} htmlFor="name">Name*</label>
                <input
                  type="text"
                  id="name"
                  placeholder='Name*'
                  {...register("name")}
                />
                {errors.name && (
                  <p className={styles.errorMessage}>{errors.name.message}</p>
                )}
              </div>

              <div className={styles.formField}>
                <label className={styles.label} htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email*"
                  {...register("email")}
                />
                {errors.email && (
                  <p className={styles.errorMessage}>{errors.email.message}</p>
                )}
              </div>

              <div className={styles.formField}>
                <label className={styles.label} htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  placeholder='Company'
                  {...register("company")}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label} htmlFor="currentUrl">Current URL</label>
                <input
                  type="text"
                  id="currentUrl"
                  placeholder="Current URL"
                  {...register("currentUrl")}
                />
              </div>


              <p className={styles.formDivider}>Services you are looking for</p>
              <div className={styles.formField} style={{ gridColumn: "span 2" }}>

                {/* Leadership & Strategy Section */}
                <div className={styles.serviceCategory} style={{ gridColumn: "span 2" }}>
                  <h3>Strategy</h3>
                  <div className={styles.checkboxGroup}>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="fractionalBusinessLeadership" value="Fractional Business Leadership" {...register("services")} />
                      <label htmlFor="fractionalBusinessLeadership">Fractional Business Leadership</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="fractionalTechnologyLeadership" value="Fractional Technology Leadership" {...register("services")} />
                      <label htmlFor="fractionalTechnologyLeadership">Fractional Technology Leadership</label>
                    </div>

                  </div>
                </div>

                {/* Design Section */}
                <div className={styles.serviceCategory} style={{ gridColumn: "span 2" }}>
                  <h3>Design</h3>
                  <div className={styles.checkboxGroup}>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="appDesign" value="App Design" {...register("services")} />
                      <label htmlFor="appDesign">App Design</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="websiteDesign" value="Website Design" {...register("services")} />
                      <label htmlFor="websiteDesign">Website Design</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="ecommerceDesign" value="Ecommerce Design" {...register("services")} />
                      <label htmlFor="ecommerceDesign">Ecommerce Design</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="brandIdentity" value="Brand Identity" {...register("services")} />
                      <label htmlFor="brandIdentity">Brand Identity</label>
                    </div>
                  </div>
                </div>

                {/* Development Section */}
                <div className={styles.serviceCategory} style={{ gridColumn: "span 2" }}>
                  <h3>Development</h3>
                  <div className={styles.checkboxGroup}>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="appDevelopment" value="App Development" {...register("services")} />
                      <label htmlFor="appDevelopment">App Development</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="websiteDevelopment" value="Website Development" {...register("services")} />
                      <label htmlFor="websiteDevelopment">Website Development</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="ecommerceDevelopment" value="Ecommerce Development" {...register("services")} />
                      <label htmlFor="ecommerceDevelopment">Ecommerce Development</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="softwareDevelopment" value="Software Development" {...register("services")} />
                      <label htmlFor="softwareDevelopment">Software Development</label>
                    </div>
                  </div>
                </div>

                {/* Other Section */}
                <div className={styles.serviceCategory} style={{ gridColumn: "span 2" }}>
                  <h3>Other</h3>
                  <div className={styles.checkboxGroup}>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="customSolutions" value="Custom Solutions" {...register("services")} />
                      <label htmlFor="customSolutions">Custom Solutions</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="auditsOptimization" value="Audits & Optimization" {...register("services")} />
                      <label htmlFor="auditsOptimization">Audit & Optimization</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="productConsulting" value="Product Consulting" {...register("services")} />
                      <label htmlFor="productConsulting">Product Consulting</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="pressInquiry" value="Press Inquiry" {...register("services")} />
                      <label htmlFor="pressInquiry">Press Inquiry</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="jobInquiry" value="Job Inquiry" {...register("services")} />
                      <label htmlFor="jobInquiry">Job Inquiry</label>
                    </div>
                    <div className={styles.checkboxItem}>
                      <input type="checkbox" id="generalInquiry" value="General Inquiry" {...register("services")} />
                      <label htmlFor="generalInquiry">General Inquiry</label>
                    </div>
                  </div>
                </div>
              </div>
              <p className={styles.formDivider}>Additional information</p>
              <div className={styles.formField} style={{ gridColumn: "span 2" }}>
                <label className={styles.label} htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={3}
                  className={styles.textareaInput}
                  placeholder="Anything you would like to share"
                  {...register("message")}
                ></textarea>
                {errors.message && (
                  <p className={styles.errorMessage}>{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </motion.div>



          <FooterContact />
        </div>
      </main>
    </>
  )
}