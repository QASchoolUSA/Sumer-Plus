import Button from '../Button/Button';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    Expert Tax & <br />
                    <span className={styles.highlight}>Business Solutions</span>
                </h1>
                <p className={styles.subtitle}>
                    Maximize your returns and streamline your business finances with Sumer Plus.
                    Professional guidance tailored to your unique needs.
                </p>
                <div className={styles.actions}>
                    <Button href="/book" variant="primary">
                        Book a Consultation
                    </Button>
                    <Button href="/services" variant="outline">
                        Explore Services
                    </Button>
                </div>
            </div>
            <div className={styles.visual}>
                {/* Placeholder for a hero image or illustration */}
                <div className={styles.placeholderImage}></div>
            </div>
        </section>
    );
}
