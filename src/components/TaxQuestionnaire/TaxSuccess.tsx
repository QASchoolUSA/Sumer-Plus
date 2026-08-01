import { Check } from "lucide-react";
import BrandButton from "@/components/Button/Button";
import styles from "./TaxSuccess.module.css";

type Props = {
  message: string;
  homeHref: string;
};

export default function TaxSuccess({ message, homeHref }: Props) {
  return (
    <div className={styles.successPage}>
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden>
          <Check size={32} />
        </div>
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.message}>{message}</p>
        <BrandButton href={homeHref} variant="primary">
          Return to Home
        </BrandButton>
      </div>
    </div>
  );
}
