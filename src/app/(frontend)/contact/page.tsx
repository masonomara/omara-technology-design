"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Footer from "@/app/components/Footer";
import { sendMail } from "@/app/lib/send-mail";
import { EMAIL_ADDRESS } from "@/app/lib/constants";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../../lib/motion";
import styles from "./page.module.css";

// ─── Schema ───────────────────────────────────────────────────────────────────

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  organization: z.string().optional(),
  message: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof contactFormSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ENGAGEMENT_OPTIONS = ["One-time Project", "Partnership"];

const CAPABILITY_OPTIONS = [
  "Mobile Apps",
  "Web Apps",
  "AI Products",
  "Ecommerce",
  "Creative Design",
  "UX Research",
  "Product Development",
];

const viewport = { once: true, amount: 0.15 } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
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
    defaultValues: { name: "", organization: "", message: "", email: "" },
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  };

  const onSubmit = async (values: FormData) => {
    setSubmitError(null);
    try {
      const mailText = `
Name: ${values.name}
Organization: ${values.organization || "Not provided"}
Email: ${values.email}

Engagement Type: ${selectedEngagement || "Not specified"}
Service Areas: ${selectedServices.length > 0 ? selectedServices.join(", ") : "Not specified"}

Message:
${values.message || "None provided."}`;

      const response = await sendMail({
        contact: values.email,
        subject: "New Contact Form Inquiry",
        text: mailText,
      });

      if (response?.messageId) {
        reset();
        setSelectedEngagement(null);
        setSelectedServices([]);
        setSubmitted(true);
      } else {
        setSubmitError(`Something went wrong. Email us directly at ${EMAIL_ADDRESS}`);
      }
    } catch (error) {
      setSubmitError(`Something went wrong. Email us directly at ${EMAIL_ADDRESS}`);
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
          viewport={viewport}
          className="title"
        >
          Contact
        </motion.h1>

        <motion.div
          className={styles.contactFormWrapper}
          variants={fadeInButton("up", 0.12, 0.35)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {submitted ? (
            <p className={styles.successMessage}>We&apos;ll be in touch.</p>
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
                <span className={styles.proseText}>and I&apos;m reaching out from</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="your company or project"
                    {...register("organization")}
                  />
                </div>
              </div>

              {/* Message */}
              <textarea
                className={styles.messageInput}
                rows={4}
                placeholder="What are you building, what's the problem, what do you need?"
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

              {/* Engagement Type */}
              <div className={styles.servicesBlock}>
                <p className={styles.servicesLabel}>We&apos;re looking for</p>
                <div className={styles.serviceGrid}>
                  {ENGAGEMENT_OPTIONS.map((option) => (
                    <label key={option} className={styles.serviceItem}>
                      <input
                        type="radio"
                        className={styles.serviceCheckbox}
                        checked={selectedEngagement === option}
                        onChange={() => setSelectedEngagement(option)}
                      />
                      <span className={styles.serviceLabel}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className={styles.servicesBlock}>
                <p className={styles.servicesLabel}>Focused on</p>
                <div className={styles.serviceGrid}>
                  {CAPABILITY_OPTIONS.map((capability) => (
                    <label key={capability} className={styles.serviceItem}>
                      <input
                        type="checkbox"
                        className={styles.serviceCheckbox}
                        checked={selectedServices.includes(capability)}
                        onChange={() => toggleService(capability)}
                      />
                      <span className={styles.serviceLabel}>{capability}</span>
                    </label>
                  ))}
                </div>
              </div>

              {submitError && <p className={styles.errorMessage}>{submitError}</p>}

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

        <motion.div
          variants={textFadeUpSmall(0.08, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className={styles.openerBlock}
        >
          <p className={styles.fallback}>
            Prefer email?{" "}
            <a className={styles.emailLink} href={`mailto:${EMAIL_ADDRESS}`}>
              {EMAIL_ADDRESS}
            </a>
          </p>
        </motion.div>

        <Footer />
      </div>
    </main>
  );
}
