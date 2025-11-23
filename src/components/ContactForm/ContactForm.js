"use client";

import { useState } from 'react';
import Button from '../Button/Button';
import styles from '../../app/[lang]/contact/page.module.css'; // Reusing styles

export default function ContactForm({ dict }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert(dict.success_message || "Message sent!");
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="name">{dict.form_name}</label>
                <input type="text" id="name" name="name" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">{dict.form_email}</label>
                <input type="email" id="email" name="email" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="message">{dict.form_message}</label>
                <textarea id="message" name="message" rows="5" required className={styles.textarea}></textarea>
            </div>
            <Button type="submit" variant="primary" className={styles.submitButton}>
                {dict.form_submit}
            </Button>
        </form>
    );
}
