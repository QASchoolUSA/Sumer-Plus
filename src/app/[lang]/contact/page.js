import { getDictionary } from '../../../i18n/get-dictionary';
import ContactForm from '@/components/ContactForm/ContactForm';
import styles from './page.module.css';

export default async function Contact({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{dict.contact_page.title}</h1>
                    <p className={styles.subtitle}>{dict.contact_page.subtitle}</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.info}>
                        <div className={styles.infoItem}>
                            <h3>{dict.contact_page.email}</h3>
                            <p>support@sumerplus.com</p>
                        </div>
                        <div className={styles.infoItem}>
                            <h3>{dict.contact_page.phone}</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className={styles.infoItem}>
                            <h3>{dict.contact_page.office}</h3>
                            <p>123 Financial District, Suite 400<br />New York, NY 10005</p>
                        </div>
                    </div>

                    <ContactForm dict={dict.contact_page} />
                </div>
            </div>
        </div>
    );
}
