import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./AboutSection.module.css";

type Props = { dict: Dictionary["about_us"] };

export default function AboutSection({ dict }: Props) {
  if (!dict) return null;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{dict.title}</h2>
        <h3 className={styles.subtitle}>{dict.subtitle}</h3>
        <div className={styles.content}>
          <p>{dict.p1}</p>
          <p>{dict.p2}</p>
          <p>{dict.p3}</p>
          <p>{dict.p4}</p>
          <p>{dict.p5}</p>
        </div>
      </div>
    </section>
  );
}
