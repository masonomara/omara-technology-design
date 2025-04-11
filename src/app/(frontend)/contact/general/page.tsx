'use client';
import Link from 'next/link';
import React from 'react';
import styles from '../../../styles/subcontact.module.css';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMail } from '@/app/lib/send-mail';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Please Enter Your Name' }),
  email: z.string().email({ message: 'Please Enter a Valid Email Address' }),
  additionalDetails: z
    .string()
    .min(10, { message: 'Please make sure your message is at least 10 characters long.' })
    .optional()
    .or(z.literal(''))
});

export default function GeneralInquiries() {
  const emailAddress = 'connect@omaratechnologydesign.com';
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      additionalDetails: '',
    },
  });
  
  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    const mailText = `Name: ${values.name}\nEmail: ${values.email}\nAdditional Details: ${values.additionalDetails || 'N/A'}`;
    try {
      const response = await sendMail({
        email: values.email,
        subject: 'New General Inquiry',
        text: mailText,
      });
      
      if (response?.messageId) {
        alert('Inquiry submitted successfully.');
        form.reset();
      } else {
        alert('Failed to send inquiry. Please try again later.');
      }
    } catch (error) {
      alert('An error occurred while submitting your inquiry. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="standardPageContainer">
      <Link className={styles.backWrapper} href="/contact" target="_top">
        <Image className={styles.backArrow} src="/redArrow.svg" height={120} width={120} alt="back" />
      </Link>
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>General Inquiries</h1>
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
          O'Mara Technology & Design is a technology consulting firm working in fractional and independent business and digital product strategy, design, and development roles.
        </p>
        <p className={styles.subtitle}>
          For any support, introductions, general interest, getting started on a project, or any other inquiries, please fill out the form below.
        </p>

        <div className={styles.contactFormWrapper}>
          <form className={styles.contactForm} onSubmit={form.handleSubmit(onSubmit)}>
            <div className={styles.formField}>
              <label className={styles.label} htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                placeholder="Name*"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className={styles.errorMessage}>{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                placeholder="Email*"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className={styles.errorMessage}>{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label className={styles.label} htmlFor="additionalDetails">Anything else you would like to share?</label>
              <textarea
                id="additionalDetails"
                rows={4}
                className={styles.textareaInput}
                placeholder="Any additional details you would like to share?"
                {...form.register("additionalDetails")}
              ></textarea>
              {form.formState.errors.additionalDetails && (
                <p className={styles.errorMessage}>{form.formState.errors.additionalDetails.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}