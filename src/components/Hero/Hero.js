import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Hero.module.css';

export default function Hero({ dict, lang }) {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    {dict.title_prefix} <br />
                    <span className={styles.highlight}>{dict.title_highlight}</span>
                </h1>
                <p className={styles.subtitle}>
                    {dict.subtitle}
                </p>
                <div className={styles.actions}>
                    <Button href={`/${lang}/book`} variant="primary">
                        {dict.cta_primary}
                    </Button>
                    <Button href={`/${lang}/resources`} variant="outline">
                        {dict.cta_secondary}
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
