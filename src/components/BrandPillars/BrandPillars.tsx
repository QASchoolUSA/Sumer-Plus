import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./BrandPillars.module.css";

type Props = { dict: Dictionary["pillars"] };

export default function BrandPillars({ dict }: Props) {
  if (!dict?.items) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{dict.title}</h2>
        <div className={styles.grid}>
          {dict.items.map((item, i) => (
            <div key={i} className={styles.pillar}>
              <h3 className={styles.pillarTitle}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
