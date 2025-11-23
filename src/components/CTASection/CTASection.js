import Button from '../Button/Button';
import styles from './CTASection.module.css';

export default function CTASection({ dict, lang }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    {dict.title}
                </h2>
                <Button href={`/${lang}/book`} variant="secondary" className={styles.button}>
                    {dict.button}
                </Button>
            </div>
        </section>
    );
}
