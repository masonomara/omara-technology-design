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
  role: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  budgetLow: z.string().optional(),
  budgetHigh: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof contactFormSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

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
      role: "",
      company: "",
      message: "",
      budgetLow: "",
      budgetHigh: "",
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
Role: ${values.role || "Not provided"}
Company / Project: ${values.company || "Not provided"}
Email: ${values.email}

Service Areas: ${selectedServices.length > 0 ? selectedServices.join(", ") : "Not specified"}

Budget: ${values.budgetLow || "Not provided"} – ${values.budgetHigh || "Not provided"}

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
        setSubmitError(
          `We're sorry, something went wrong. Feel free to email us directly at ${EMAIL_ADDRESS}`,
        );
      }
    } catch (error) {
      setSubmitError(
        `We're sorry, something went wrong. Feel free to email us directly at ${EMAIL_ADDRESS}`,
      );
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
            <p className={styles.successMessage}>
              Thank you for considering us. We&apos;ll be in touch soon.
            </p>
          ) : (
            <form
              className={styles.contactForm}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Name */}
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
                <span className={styles.proseText}>.</span>
              </div>

              {/* Role + Company */}
              <div className={styles.proseLine}>
                <span className={styles.proseText}>I am the</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="role"
                    {...register("role")}
                  />
                </div>
                <span className={styles.proseText}>of</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="company or project"
                    {...register("company")}
                  />
                </div>
                <span className={styles.proseText}>.</span>
              </div>

              {/* Service Areas */}
              <div className={styles.servicesBlock}>
                <p className={styles.servicesLabel}>We&apos;re looking for:</p>
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

              {/* Message */}
              <textarea
                className={styles.messageInput}
                rows={4}
                placeholder="Tell us more... what are you building, what's the problem, what do you need?"
                {...register("message")}
              />

              {/* Budget */}
              <div className={styles.proseLine}>
                <span className={styles.proseText}>Our budget ranges from</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="low price"
                    {...register("budgetLow")}
                  />
                </div>
                <span className={styles.proseText}>to</span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="high price"
                    {...register("budgetHigh")}
                  />
                </div>
                <span className={styles.proseText}>.</span>
              </div>

              {/* Email */}
              <div className={styles.proseLine}>
                <span className={styles.proseText}>
                  The best place to reach me is
                </span>
                <div className={styles.inlineFieldWrapper}>
                  <input
                    className={styles.inlineInput}
                    placeholder="email address"
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
