"use client";

import React, { useState } from "react";
import styles from "../../styles/contact.module.css";
import { sendMail } from "@/app/lib/send-mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../../lib/motion";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  organization: z.string().optional(),
  message: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof contactFormSchema>;

const SERVICE_OPTIONS = [
  "Website / Web App Design",
  "Website / Web App Development",
  "Mobile App Development",
  "Product Strategy",
  "AI Engineering",
  "Ongoing Partnership",
];

export default function Contact() {
  const emailAddress = "info@omaratechnology.com";
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      organization: "",
      message: "",
      email: "",
    },
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const onSubmit = async (values: FormData) => {
    setSubmitError(null);
    try {
      const mailText = `
Name: ${values.name}
Organization: ${values.organization || "Not provided"}
Email: ${values.email}

Looking for:
${selectedServices.length > 0 ? selectedServices.join(", ") : "Not specified"}

Message:
${values.message || "None provided."}`;

      const response = await sendMail({
        contact: values.email,
        subject: "New Contact Form Inquiry",
        text: mailText,
      });

      if (response?.messageId) {
        reset();
        setSelectedServices([]);
        setSubmitted(true);
      } else {
        setSubmitError(`Something went wrong. Email us directly at ${emailAddress}`);
      }
    } catch (error) {
      setSubmitError(`Something went wrong. Email us directly at ${emailAddress}`);
      console.error(error);
    }
  };

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <motion.h1
          variants={textFadeUp(0, 0.45)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="title"
        >
          Contact
        </motion.h1>

        <motion.div
          variants={textFadeUpSmall(0.08, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={styles.openerBlock}
        >
          <p className={styles.opener}>
            If something here looks right, let&apos;s talk.
          </p>
          <p className={styles.fallback}>
            Not a forms person? Email us at{" "}
            <a className={styles.emailLink} href={`mailto:${emailAddress}`}>
              {emailAddress}
            </a>{" "}
            or find us on{" "}
            <a
              className={styles.emailLink}
              href="https://linkedin.com/company/omaratechnology"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            .
          </p>
        </motion.div>

        <motion.div
          className={styles.contactFormWrapper}
          variants={fadeInButton("up", 0.12, 0.35)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {submitted ? (
            <p className={styles.successMessage}>
              We&apos;ll be in touch.
            </p>
          ) : (
            <form className={styles.contactForm} onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Name + Organization */}
              <div className={styles.proseLine}>
                <span className={styles.proseText}>My name is</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className={styles.inlineError}>{errors.name.message}</p>
                  )}
                </div>
                <span className={styles.proseText}>
                  and I&apos;m reaching out from
                </span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="your company or project"
                    {...register("organization")}
                  />
                </div>
              </div>

              {/* Services */}
              <div className={styles.servicesBlock}>
                <p className={styles.servicesLabel}>We&apos;re looking for</p>
                <div className={styles.serviceGrid}>
                  {SERVICE_OPTIONS.map((service) => (
                    <label key={service} className={styles.serviceItem}>
                      <input
                        type="checkbox"
                        className={styles.serviceCheckbox}
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      <span className={styles.serviceLabel}>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <textarea
                className={styles.messageInput}
                rows={4}
                placeholder="Tell us more — what's the project, what's the problem, where are you in it?"
                {...register("message")}
              />

              {/* Email */}
              <div className={styles.proseLine}>
                <span className={styles.proseText}>You can reach me at</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className={styles.inlineError}>{errors.email.message}</p>
                  )}
                </div>
              </div>

              {submitError && (
                <p className={styles.errorMessage}>{submitError}</p>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          )}
        </motion.div>

        <Footer />
      </div>
    </main>
  );
}
