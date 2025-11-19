import Button from '@/components/Button/Button';
import styles from './page.module.css';

export default function Services() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Our Services</h1>
                <p className={styles.subtitle}>Tailored financial solutions for individuals and businesses.</p>
            </header>

            <section id="personal" className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Personal Tax Services</h2>
                    <p className={styles.sectionDescription}>
                        Navigating personal taxes can be complex. We ensure you get the maximum refund possible while staying fully compliant.
                    </p>
                    <ul className={styles.featureList}>
                        <li>Individual Tax Return Preparation (1040)</li>
                        <li>State & Local Tax Filing</li>
                        <li>Tax Planning & Advisory</li>
                        <li>IRS Audit Representation</li>
                        <li>Estate & Trust Tax Services</li>
                    </ul>
                    <Button href="/book" variant="primary">Book Personal Consultation</Button>
                </div>
                <div className={styles.visual}>
                    {/* Placeholder for personal tax image */}
                    <div className={`${styles.placeholderImage} ${styles.personalImage}`}></div>
                </div>
            </section>

            <section id="business" className={`${styles.section} ${styles.reversed}`}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Business Tax Services</h2>
                    <p className={styles.sectionDescription}>
                        From startups to established corporations, we provide strategic tax planning to help your business grow.
                    </p>
                    <ul className={styles.featureList}>
                        <li>Corporate Tax Filings (1120, 1120S)</li>
                        <li>Partnership Tax Filings (1065)</li>
                        <li>Bookkeeping & Payroll Services</li>
                        <li>New Business Formation</li>
                        <li>Quarterly Estimated Tax Planning</li>
                    </ul>
                    <Button href="/book" variant="primary">Book Business Consultation</Button>
                </div>
                <div className={styles.visual}>
                    {/* Placeholder for business tax image */}
                    <div className={`${styles.placeholderImage} ${styles.businessImage}`}></div>
                </div>
            </section>
        </div>
    );
}
