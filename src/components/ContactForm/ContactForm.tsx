"use client";

import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import styles from "../../app/[lang]/contact/page.module.css";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary["contact_page"] };

export default function ContactForm({ dict }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Contact",
          data: { name, email, message },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">{dict.form_name}</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={submitting}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">{dict.form_email}</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={submitting}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message">{dict.form_message}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={submitting}
          className={styles.textarea}
        />
      </div>
      {status === "success" && (
        <p className={styles.statusSuccess} role="status">
          {dict.success_message}
        </p>
      )}
      {status === "error" && (
        <p className={styles.statusError} role="alert">
          {dict.error_message}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        className={styles.submitButton}
        disabled={submitting}
      >
        {submitting ? dict.form_submitting : dict.form_submit}
      </Button>
    </form>
  );
}
