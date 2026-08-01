import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./AutonomyBlock.module.css";

type Props = { dict: Dictionary["autonomy"] };

export default function AutonomyBlock({ dict }: Props) {
  if (!dict) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{dict.title}</h2>
        <p className={styles.body}>{dict.body}</p>
        <div className={styles.free}>
          <h3 className={styles.freeTitle}>{dict.free_title}</h3>
          <p className={styles.freeBody}>{dict.free_body}</p>
        </div>
      </div>
    </section>
  );
}
