import Hero from '@/components/Hero/Hero';
import ServiceCard from '@/components/ServiceCard/ServiceCard';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />

      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <p className={styles.sectionSubtitle}>Comprehensive financial solutions for every stage of life and business.</p>
        </div>

        <div className={styles.servicesGrid}>
          <ServiceCard
            title="Personal Taxes"
            description="Maximize your refund with our expert personal tax preparation services. We handle complex situations with ease."
            href="/services#personal"
          />
          <ServiceCard
            title="Business Taxes"
            description="Strategic tax planning and filing for small businesses and corporations. Stay compliant and optimize your liability."
            href="/services#business"
          />
          <ServiceCard
            title="Consultation"
            description="One-on-one sessions to discuss your financial goals, tax strategies, and business planning."
            href="/book"
          />
        </div>
      </section>
    </div>
  );
}
