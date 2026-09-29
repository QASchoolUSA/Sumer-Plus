import { getDictionary } from "../../../i18n/get-dictionary";
import Button from "@/components/Button/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.services_page.title} | SumerPlus`,
    description: dict.services_page.subtitle,
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.services_page;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.subtitle}>{page.subtitle}</p>
        </div>
      </header>

      <div className={styles.content}>
        {page.items.map((service, idx) => (
          <article
            key={service.id}
            id={service.id}
            className={`${styles.section} ${idx > 0 ? styles.sectionBorder : ""}`}
          >
            <h2 className={styles.sectionTitle}>{service.title}</h2>
            <p className={styles.sectionSub}>{service.subtitle}</p>
            <p className={styles.sectionDesc}>{service.description}</p>
            <ul className={styles.features}>
              {service.features.map((f, i) => (
                <li key={i}>
                  <CheckCircle2 className={styles.check} aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button href={`/${lang}/book`} variant="primary" className={styles.cta}>
              {page.book_cta}
              <ArrowRight className={styles.arrow} />
            </Button>
          </article>
        ))}

        <div className={styles.insuranceBanner}>
          <p className={styles.insuranceBannerTag}>
            {dict.insurance_page.instant_portal.tagline}
          </p>
          <p className={styles.insuranceBannerSub}>
            {dict.insurance_page.subtitle}
          </p>
          <div className={styles.insuranceBannerActions}>
            <Button
              href={SITE.insurancePortalUrl}
              external
              variant="primary"
              className={styles.insuranceBannerQuoteBtn}
            >
              <span>{page.instant_quote_cta}</span>
              <span aria-hidden>↗</span>
            </Button>
            <Button href={`/${lang}/insurance`} variant="outline">
              {page.insurance_cta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
