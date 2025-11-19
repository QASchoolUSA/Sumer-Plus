"use client";

import { useState } from 'react';
import Button from '@/components/Button/Button';
import styles from './page.module.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Contact Us</h1>
                <p className={styles.subtitle}>Have questions? We're here to help.</p>
            </header>

            <div className={styles.content}>
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <h3>Email</h3>
                        <p>support@sumerplus.com</p>
                    </div>
                    <div className={styles.infoItem}>
                        <h3>Phone</h3>
                        <p>(555) 123-4567</p>
                    </div>
                    <div className={styles.infoItem}>
                        <h3>Office</h3>
                        <p>123 Finance Street<br />New York, NY 10001</p>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className={styles.textarea}
                        ></textarea>
                    </div>

                    <Button type="submit" variant="primary" className={styles.submitBtn}>
                        Send Message
                    </Button>
                </form>
            </div>
        </div>
    );
}
