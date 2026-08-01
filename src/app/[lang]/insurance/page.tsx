import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import Button from "@/components/Button/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/insurance",
    title: `${dict.insurance_page.title} | SumerPlus`,
    description: dict.insurance_page.subtitle,
  });
}

export default async function InsurancePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.insurance_page;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.subtitle}>{page.subtitle}</p>
          <p className={styles.definition}>{page.definition}</p>
          <p className={styles.intro}>{page.intro}</p>
          <Button href={`/${lang}/book`} variant="primary">
            {page.book_cta}
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        {page.sections.map((section, idx) => (
          <article
            key={section.id}
            id={section.id}
            className={`${styles.section} ${idx > 0 ? styles.sectionBorder : ""}`}
          >
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.sectionSub}>{section.subtitle}</p>
            <p className={styles.sectionDesc}>{section.description}</p>
            <ul className={styles.features}>
              {section.features.map((f, i) => (
                <li key={i}>
                  <CheckCircle2 className={styles.check} aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}

        <section className={styles.proof}>
          <h2 className={styles.proofTitle}>{page.proof_title}</h2>
          <div className={styles.proofGrid}>
            {page.proof_items.map((item, i) => (
              <div key={i} className={styles.proofItem}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.actions}>
          <Button href={`/${lang}/book`} variant="primary">
            {page.book_cta}
            <ArrowRight className={styles.arrow} />
          </Button>
          <Button href={`/${lang}/leakage`} variant="secondary">
            {dict.navigation.leakage}
          </Button>
          <Button href={`/${lang}/services`} variant="outline">
            {dict.navigation.services}
          </Button>
        </div>
      </div>
    </div>
  );
}
