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
  "Mobile App",
  "Website/Web App",
  "AI Product",
  "Ecommerce",
  "Creative Design",
  "UX Research",
  "Product Development",
  "Something else",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactForm() {
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
          animate="show"
          className="title"
          style={{ marginBottom: 0 }}
        >
          Contact
        </motion.h1>

        <motion.div
          className={styles.contactFormWrapper}
          variants={fadeInButton("up", 0.12, 0.35)}
          initial="hidden"
          animate="show"
        >
          {submitted ? (
            <p className={styles.successMessage}>
              Thank you for considering us. We&apos;ll be in touch soon.
            </p>
          ) : (
            <>
              <form
                id="contact-form"
                className={styles.contactForm}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Name */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="contact-name"
                    className={styles.fieldLabel}
                    style={{ marginTop: 0 }}
                  >
                    My name is:
                  </label>
                  <input
                    id="contact-name"
                    className={styles.fieldInput}
                    placeholder="Your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className={styles.fieldError}>{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-email" className={styles.fieldLabel}>
                    My best email is:
                  </label>
                  <input
                    id="contact-email"
                    className={styles.fieldInput}
                    placeholder="your@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className={styles.fieldError}>{errors.email.message}</p>
                  )}
                </div>

                {/* Role + Company */}
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-role" className={styles.fieldLabel}>
                      I am the:
                    </label>
                    <input
                      id="contact-role"
                      className={styles.fieldInput}
                      placeholder="Your role"
                      {...register("role")}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label
                      htmlFor="contact-company"
                      className={styles.fieldLabel}
                    >
                      at:
                    </label>
                    <input
                      id="contact-company"
                      className={styles.fieldInput}
                      placeholder="Company or project name"
                      {...register("company")}
                    />
                  </div>
                </div>

                {/* Service Areas */}
                <div className={styles.servicesBlock}>
                  <p className={styles.fieldLabel}>I am looking for:</p>
                  <div className={styles.serviceGrid}>
                    {CAPABILITY_OPTIONS.map((capability) => (
                      <label key={capability} className={styles.serviceItem}>
                        <input
                          type="checkbox"
                          className={styles.serviceCheckbox}
                          checked={selectedServices.includes(capability)}
                          onChange={() => toggleService(capability)}
                        />
                        <span className={styles.serviceLabel}>
                          {capability}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="contact-message"
                    className={styles.fieldLabel}
                  ></label>
                  <textarea
                    id="contact-message"
                    aria-label="Your message"
                    className={styles.messageInput}
                    rows={4}
                    placeholder="Tell us more about what you're building, where you're stuck, or what you need."
                    {...register("message")}
                  />
                </div>

                {/* Budget */}
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label
                      htmlFor="contact-budget-low"
                      className={styles.fieldLabel}
                    >
                      My budget is:
                    </label>
                    <input
                      id="contact-budget-low"
                      className={styles.fieldInput}
                      placeholder="e.g. $5,000"
                      {...register("budgetLow")}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label
                      htmlFor="contact-budget-high"
                      className={styles.fieldLabel}
                    >
                      to:
                    </label>
                    <input
                      id="contact-budget-high"
                      className={styles.fieldInput}
                      placeholder="e.g. $20,000"
                      {...register("budgetHigh")}
                    />
                  </div>
                </div>

                {submitError && (
                  <p className={styles.errorMessage}>{submitError}</p>
                )}
              </form>

              <button
                type="submit"
                form="contact-form"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </>
          )}
        </motion.div>

        <motion.div
          variants={textFadeUpSmall(0.08, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={styles.openerBlock}
        >
          <p className={styles.fallback}>
            Online forms not your thing? Feel free to email us at{" "}
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
