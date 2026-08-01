"use client";

import type { FormEvent } from "react";
import Button from "../Button/Button";
import styles from "../../app/[lang]/contact/page.module.css";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary["contact_page"] };

export default function ContactForm({ dict }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(dict.success_message || "Message sent!");
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
          className={styles.textarea}
        />
      </div>
      <Button type="submit" variant="primary" className={styles.submitButton}>
        {dict.form_submit}
      </Button>
    </form>
  );
}
