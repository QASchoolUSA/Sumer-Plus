import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import JsonLd from "@/components/JsonLd/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/faq",
    title: `${dict.faq_page.title} | SumerPlus`,
    description: dict.faq_page.subtitle,
  });
}

export default async function FaqPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.faq_page;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: absoluteUrl(lang, "/faq"),
    inLanguage: lang,
  };

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
        name: dict.navigation.faq,
        item: absoluteUrl(lang, "/faq"),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <JsonLd data={[faqSchema, breadcrumbSchema]} />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.subtitle}>{page.subtitle}</p>
        </div>
      </header>

      <div className={styles.content}>
        {page.items.map((item, index) => (
          <article key={index} className={styles.item} id={`faq-${index + 1}`}>
            <h2 className={styles.question}>{item.q}</h2>
            <p className={styles.answer}>{item.a}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
