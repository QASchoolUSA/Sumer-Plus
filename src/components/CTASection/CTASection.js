import Button from '../Button/Button';
import styles from './CTASection.module.css';

export default function CTASection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    Ready to take your business to the next level of financial control and compliance with US standards?
                </h2>
                <Button href="/book" variant="secondary" className={styles.button}>
                    Schedule a call
                </Button>
            </div>
        </section>
    );
}
