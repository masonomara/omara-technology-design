"use client";

import React, { useState, useRef } from "react";
import styles from "../../styles/contact.module.css";
import { sendMail } from "@/app/lib/send-mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FooterContact from "@/app/components/FooterContact";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../../lib/motion";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  inquiry: z.string().optional(),
  additional: z.string().optional(),
});

type FormData = z.infer<typeof contactFormSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
];

export default function Contact() {
  const emailAddress = "info@omaratechnology.com";
  const [showFileModal, setShowFileModal] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiry: "",
      additional: "",
    },
  });

  const validateAndSetFile = (file: File) => {
    setFileError(null);

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be under 5MB");
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError("Please upload a PDF, DOC, DOCX, TXT, PNG, or JPG file");
      return;
    }

    setAttachedFile(file);
    setShowFileModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (values: FormData) => {
    try {
      const mailText = `
Name: ${values.name}
Email: ${values.email}

Inquiry:
${values.inquiry}

Additional Information:
${values.additional || "None provided."}`;

      let attachment:
        | { filename: string; content: string; encoding: "base64" }
        | undefined;

      if (attachedFile) {
        const base64Content = await fileToBase64(attachedFile);
        attachment = {
          filename: attachedFile.name,
          content: base64Content,
          encoding: "base64",
        };
      }

      const response = await sendMail({
        contact: values.email,
        subject: "New Contact Form Inquiry",
        text: mailText,
        attachment,
      });

      if (response?.messageId) {
        alert("Email delivered. Thank you for contacting us.");
        reset();
        setAttachedFile(null);
      } else {
        alert("Email failed. Please try again or email us directly.");
      }
    } catch (error) {
      alert("Email failed. Please try again or email us directly.");
      console.error(error);
    }
  };

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <motion.h1
          variants={textFadeUp("up", "spring", 0.1, 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}
          className="title"
        >
          Contact
        </motion.h1>
        <motion.div
          variants={textFadeUpSmall("up", "spring", 0.2, 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}
        >
          <p className={styles.emailInfo}>
            To work together, please fill out the form below.
          </p>
          <p className={styles.subtitle}>
            Contact forms not your thing? Email us at{" "}
            <a className={styles.emailLink} href={`mailto:${emailAddress}`}>
              {emailAddress}
            </a>
          </p>
          <p className={styles.subtitle} style={{ marginBottom: "2.4em" }}>
            Other places you can find us:{" "}
            <a
              className={styles.emailLink}
              href="https://linkedin.com/company/omaratechnology"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </motion.div>
        <motion.div
          className={styles.contactFormWrapper}
          variants={fadeInButton("up", "spring", 0.4, 1.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}
        >
          <form
            className={styles.contactForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.formField}>
              <label className={styles.label} htmlFor="name">
                Name
              </label>
              <input id="name" placeholder="Your name" {...register("name")} />
              {errors.name && (
                <p className={styles.errorMessage}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="email">
                Best way to contact you
              </label>
              <input
                id="email"
                placeholder="Best way to contact you"
                {...register("email")}
              />
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label className={styles.label} htmlFor="inquiry">
                Inquiry
              </label>
              <textarea
                id="inquiry"
                rows={2}
                className={styles.textareaInput}
                placeholder="Your inquiry"
                {...register("inquiry")}
              />
              {errors.inquiry && (
                <p className={styles.errorMessage}>{errors.inquiry.message}</p>
              )}
            </div>

            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label className={styles.label} htmlFor="additional">
                Anything else you&apos;d like to share
              </label>
              <textarea
                id="additional"
                rows={4}
                className={styles.textareaInput}
                placeholder="Anything else you'd like to share"
                {...register("additional")}
              />
            </div>

            <div
              className={styles.formField}
              style={{
                gridColumn: "span 2",
                display: "flex",
                flexDirection: "row",
                gap: "12px",
              }}
            >
              <button
                type="button"
                className={styles.instructions}
                onClick={() => setShowFileModal(true)}
              >
                {attachedFile
                  ? `Attached: ${attachedFile.name}`
                  : "Include a file"}
              </button>
              {attachedFile && (
                <button
                  type="button"
                  className={styles.instructions}
                  onClick={() => setAttachedFile(null)}
                >
                  Remove file
                </button>
              )}
            </div>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </motion.div>

        {showFileModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowFileModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div
                className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <p>Drop file here, or click to select</p>
                <span className={styles.dropZoneHint}>
                  (PDF, DOC, DOCX, TXT, PNG, JPG)
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                style={{ display: "none" }}
              />
              {fileError && <p className={styles.errorMessage}>{fileError}</p>}
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  setShowFileModal(false);
                  setFileError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <FooterContact />
      </div>
    </main>
  );
}
