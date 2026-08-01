import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import ContactForm from "@/components/ContactForm/ContactForm";
import { buildPageMetadata } from "@/lib/seo";
import { SITE, formatSiteAddress } from "@/lib/site";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/contact",
    title: `${dict.contact_page.title} | SumerPlus`,
    description: dict.contact_page.subtitle,
  });
}

export default async function Contact({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const [street, cityLine] = formatSiteAddress(true).split("\n");

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
              <h2>{dict.contact_page.email}</h2>
              <p>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>
            <div className={styles.infoItem}>
              <h2>{dict.contact_page.phone}</h2>
              <p>
                <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
              </p>
            </div>
            <div className={styles.infoItem}>
              <h2>{dict.contact_page.office}</h2>
              <address>
                {street}
                <br />
                {cityLine}
              </address>
            </div>
            <div className={styles.infoItem}>
              <h2>{dict.contact_page.instagram}</h2>
              <p>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{SITE.instagramHandle}
                </a>
              </p>
            </div>
          </div>

          <ContactForm dict={dict.contact_page} />
        </div>
      </div>
    </div>
  );
}
