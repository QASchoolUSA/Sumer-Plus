import Link from "next/link";
import styles from "./ServiceCard.module.css";

type Props = {
  title: string;
  description: string;
  href: string;
};

export default function ServiceCard({ title, description, href }: Props) {
  return (
    <Link href={href} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <span className={styles.linkText}>Learn more &rarr;</span>
    </Link>
  );
}
