import BookingEmbed from '@/components/BookingEmbed/BookingEmbed';
import styles from './page.module.css';

export default function Book() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Book a Consultation</h1>
                <p className={styles.subtitle}>Select a time that works for you. We look forward to speaking with you.</p>
            </div>

            <div className={styles.embedContainer}>
                <BookingEmbed />
            </div>
        </div>
    );
}
