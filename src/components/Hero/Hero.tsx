import Image from "next/image";
import Button from "../Button/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Hero.module.css";

type Props = {
  dict: Dictionary["hero"];
  lang: string;
};

export default function Hero({ dict, lang }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Image
            src="/brand/logo-512.webp"
            alt=""
            width={200}
            height={200}
            className={styles.seal}
            priority
            unoptimized
            style={{ background: "transparent" }}
          />
          <p className={styles.brand}>{dict.brand}</p>
          <p className={styles.descriptor}>{dict.descriptor}</p>
        </div>

        <h1 className={styles.headline}>{dict.headline}</h1>
        <p className={styles.subtitle}>{dict.subtitle}</p>
        <p className={styles.metric}>{dict.metric}</p>
        <p className={styles.freeNote}>{dict.free_note}</p>

        <div className={styles.actions}>
          <Button href={`/${lang}/book`} variant="primary">
            {dict.cta_primary}
          </Button>
          <Button href={`/${lang}/leakage`} variant="secondary">
            {dict.cta_secondary}
          </Button>
          <Button href={`/${lang}/calculator`} variant="outline">
            {dict.cta_tertiary}
          </Button>
        </div>
      </div>
    </section>
  );
}
