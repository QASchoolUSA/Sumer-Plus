import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    Your outsourced <br />
                    <span className={styles.highlight}>Chief Financial Officer</span>
                </h1>
                <p className={styles.subtitle}>
                    CFO and accounting services under the supervision of certified US CPAs and lawyers.
                </p>
                <div className={styles.actions}>
                    <Button href="/book" variant="primary">
                        Schedule a Consultation
                    </Button>
                    <Button href="/resources" variant="outline">
                        Download templates and tools
                    </Button>
                </div>
            </div>
            <div className={styles.visual}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/hero-image.png"
                        alt="Financial Growth Illustration"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
