import { getDictionary } from '../../../i18n/get-dictionary';
import CTASection from '@/components/CTASection/CTASection';
import Button from '@/components/Button/Button';
import styles from './page.module.css';

export default async function Services({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>{dict.services_page.title}</h1>
                <p className={styles.subtitle}>{dict.services_page.subtitle}</p>
            </header>

            <section id="personal" className={styles.section}>
                <div className={styles.content}>
                    <h2 className={styles.sectionTitle}>{dict.services_page.personal_title}</h2>
                    <p className={styles.sectionDescription}>
                        {dict.services_page.personal_desc}
                    </p>
                    <ul className={styles.list}>
                        {dict.services_page.personal_list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <Button href={`/${lang}/book`} variant="primary">
                        {dict.services_page.personal_cta}
                    </Button>
                </div>
                <div className={styles.visual}>
                    <div className={styles.placeholder}></div>
                </div>
            </section>

            <section id="business" className={`${styles.section} ${styles.reverse}`}>
                <div className={styles.content}>
                    <h2 className={styles.sectionTitle}>{dict.services_page.business_title}</h2>
                    <p className={styles.sectionDescription}>
                        {dict.services_page.business_desc}
                    </p>
                    <ul className={styles.list}>
                        {dict.services_page.business_list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <Button href={`/${lang}/book`} variant="primary">
                        {dict.services_page.business_cta}
                    </Button>
                </div>
                <div className={styles.visual}>
                    <div className={styles.placeholder}></div>
                </div>
            </section>

            <CTASection dict={dict.cta_section} lang={lang} />
        </div>
    );
}
