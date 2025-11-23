import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ dict, lang }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>Sumer Plus</h3>
                        <p className={styles.tagline}>{dict.tagline}</p>
                    </div>

                    <div className={styles.links}>
                        <h4>{dict.quick_links}</h4>
                        <ul>
                            <li><Link href={`/${lang}`}>{dict.home}</Link></li>
                            <li><Link href={`/${lang}/services`}>{dict.services}</Link></li>
                            <li><Link href={`/${lang}/book`}>{dict.book}</Link></li>
                            <li><Link href={`/${lang}/contact`}>{dict.contact}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contact}>
                        <h4>{dict.contact}</h4>
                        <p>Email: support@sumerplus.com</p>
                        {/* Add more contact info as needed */}
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} Sumer Plus. {dict.rights}</p>
                </div>
            </div>
        </footer>
    );
}
