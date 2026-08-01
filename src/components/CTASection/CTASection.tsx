import Button from "../Button/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./CTASection.module.css";

type Props = {
  dict: Dictionary["cta_section"];
  lang: string;
};

export default function CTASection({ dict, lang }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{dict.title}</h2>
        <Button
          href={`/${lang}/book`}
          variant="secondary"
          className={styles.button}
        >
          {dict.button}
        </Button>
      </div>
    </section>
  );
}
