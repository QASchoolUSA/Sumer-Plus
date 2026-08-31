import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import JsonLd from "@/components/JsonLd/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.disclosures_page;
  return buildPageMetadata({
    lang,
    path: "/disclosures",
    title: `${page.title} | SumerPlus`,
    description: page.subtitle,
  });
}

export default async function DisclosuresPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.disclosures_page;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.navigation.home,
        item: absoluteUrl(lang, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: absoluteUrl(lang, "/disclosures"),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <JsonLd data={[breadcrumbSchema]} />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.subtitle}>{page.subtitle}</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Intro Banner */}
        <section className={styles.introCard} id="legal-disclosures">
          <p>{page.intro_p1}</p>
          <p>{page.intro_p2}</p>
        </section>

        {/* Licensing */}
        <section className={styles.section} id="licensing">
          <h2 className={styles.sectionTitle}>{page.licensing_title}</h2>
          <p className={styles.paragraph}>{page.licensing_body}</p>
          <div className={styles.licenseGrid}>
            {page.licensing_items.map((item, index) => (
              <div key={index} className={styles.licenseCard}>
                <span className={styles.licenseLabel}>{item.label}</span>
                <span className={styles.licenseValue}>{item.value}</span>
              </div>
            ))}
          </div>
          <p className={styles.licenseFooter}>{page.licensing_footer}</p>
        </section>

        {/* Quotes & Coverage */}
        <section className={styles.section} id="quotes-coverage">
          <h2 className={styles.sectionTitle}>{page.quotes_title}</h2>
          <p className={styles.paragraph}>{page.quotes_p1}</p>
          <p className={styles.paragraph}>{page.quotes_p2}</p>
          <p className={styles.paragraph}>{page.quotes_p3}</p>
        </section>

        {/* Tax & Legal Information */}
        <section className={styles.section} id="tax-legal">
          <h2 className={styles.sectionTitle}>{page.tax_legal_title}</h2>
          <p className={styles.paragraph}>{page.tax_legal_p1}</p>
          <p className={styles.paragraph}>{page.tax_legal_p2}</p>
        </section>

        {/* Third-Party Websites */}
        <section className={styles.section} id="third-party">
          <h2 className={styles.sectionTitle}>{page.third_party_title}</h2>
          <p className={styles.paragraph}>{page.third_party_body}</p>
        </section>

        {/* Privacy & Communications */}
        <section className={styles.section} id="privacy-communications">
          <h2 className={styles.sectionTitle}>{page.privacy_title}</h2>
          <p className={styles.paragraph}>{page.privacy_p1}</p>
          <p className={styles.paragraph}>{page.privacy_p2}</p>
        </section>

        {/* Important Notice */}
        <section className={styles.importantCard} id="important">
          <h2 className={styles.importantTitle}>{page.important_title}</h2>
          <p className={styles.paragraph}>{page.important_body}</p>
        </section>

        {/* CTA */}
        <div className={styles.ctaBox}>
          <h3>Have questions about our disclosures or services?</h3>
          <Button href={`/${lang}/contact`} variant="primary">
            {dict.navigation.contact || "Contact Us"}
          </Button>
        </div>
      </div>
    </div>
  );
}
