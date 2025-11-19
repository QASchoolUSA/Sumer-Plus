import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>Sumer Plus</h3>
                        <p className={styles.tagline}>Professional Tax & Business Services</p>
                    </div>

                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/services">Services</Link></li>
                            <li><Link href="/book">Book Consultation</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contact}>
                        <h4>Contact</h4>
                        <p>Email: support@sumerplus.com</p>
                        {/* Add more contact info as needed */}
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} Sumer Plus. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
