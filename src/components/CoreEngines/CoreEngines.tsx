import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./CoreEngines.module.css";

type Props = { dict: Dictionary["engines"] };

export default function CoreEngines({ dict }: Props) {
  if (!dict?.items) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{dict.title}</h2>
        <p className={styles.subtitle}>{dict.subtitle}</p>
        <div className={styles.grid}>
          {dict.items.map((item, i) => (
            <article key={i} className={styles.item}>
              <span className={styles.letter}>
                {String.fromCharCode(65 + i)}
              </span>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
