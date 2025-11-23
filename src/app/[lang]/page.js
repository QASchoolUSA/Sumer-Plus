import { getDictionary } from '../../i18n/get-dictionary';
import Hero from '@/components/Hero/Hero';
import ValueAdvantage from '@/components/ValueAdvantage/ValueAdvantage';
import ServiceCard from '@/components/ServiceCard/ServiceCard';
import CTASection from '@/components/CTASection/CTASection';
import styles from './page.module.css';

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.page}>
      <Hero dict={dict.hero} lang={lang} />
      <ValueAdvantage dict={dict.value_advantage} />

      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dict.services_section.title}</h2>
          <p className={styles.sectionSubtitle}>{dict.services_section.subtitle}</p>
        </div>

        <div className={styles.servicesGrid}>
          <ServiceCard
            title={dict.services_section.personal_title}
            description={dict.services_section.personal_desc}
            href={`/${lang}/services#personal`}
            linkText={dict.services_section.learn_more}
          />
          <ServiceCard
            title={dict.services_section.business_title}
            description={dict.services_section.business_desc}
            href={`/${lang}/services#business`}
            linkText={dict.services_section.learn_more}
          />
          <ServiceCard
            title={dict.services_section.consultation_title}
            description={dict.services_section.consultation_desc}
            href={`/${lang}/book`}
            linkText={dict.services_section.learn_more}
          />
        </div>
      </section>

      <CTASection dict={dict.cta_section} lang={lang} />
    </div>
  );
}
