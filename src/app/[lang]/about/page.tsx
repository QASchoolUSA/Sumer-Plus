import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import Button from "@/components/Button/Button";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/about",
    title: `${dict.about_page.title} | SumerPlus`,
    description: dict.about_page.subtitle,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.about_page;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Image
          src="/brand/logo-256.webp"
          alt=""
          width={100}
          height={100}
          className={styles.seal}
          unoptimized
          style={{ background: "transparent" }}
        />
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>
        <p className={styles.definition}>{page.definition}</p>
      </header>

      <div className={styles.content}>
        <section className={styles.block}>
          <h2>{page.name_title}</h2>
          <p>{page.name_body}</p>
        </section>

        <section className={styles.block}>
          <h2>{page.logo_title}</h2>
          <p>{page.logo_body}</p>
        </section>

        <p className={styles.tagline}>{page.tagline}</p>

        <div className={styles.pillars}>
          {dict.pillars.items.map((item, i) => (
            <div key={i} className={styles.pillar}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <section className={styles.block}>
          <h2>{dict.autonomy.title}</h2>
          <p>{dict.autonomy.body}</p>
          <h3 className={styles.freeTitle}>{dict.autonomy.free_title}</h3>
          <p>{dict.autonomy.free_body}</p>
        </section>

        <div className={styles.actions}>
          <Button href={`/${lang}/book`} variant="primary">
            {dict.hero.cta_primary}
          </Button>
          <Button href={`/${lang}/insurance`} variant="secondary">
            {dict.navigation.insurance}
          </Button>
        </div>
      </div>
    </div>
  );
}
