import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Hero.module.css';

export default function Hero({ dict, lang }) {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    {dict.title_prefix}
                </h1>
                <p className={styles.subtitle}>
                    {dict.subtitle}
                </p>
                <div className={styles.actions}>
                    <Button href={`/${lang}/calculator`} variant="primary">
                        {dict.cta_primary}
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
