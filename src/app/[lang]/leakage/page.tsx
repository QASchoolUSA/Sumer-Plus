import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import LeakageCalculator from "@/components/LeakageCalculator/LeakageCalculator";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/leakage",
    title: `${dict.leakage_page.title} | SumerPlus`,
    description: dict.leakage_page.subtitle,
  });
}

export default async function LeakagePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.leakage_page;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>
      </header>
      <LeakageCalculator dict={page} lang={lang} />
    </div>
  );
}
