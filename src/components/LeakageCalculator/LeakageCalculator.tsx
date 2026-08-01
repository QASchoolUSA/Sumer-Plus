"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button/Button";
import Link from "next/link";
import styles from "./LeakageCalculator.module.css";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n-config";

const LOCALE_MAP: Record<Locale, string> = {
  en: "en-US",
  es: "es-US",
  ru: "ru-RU",
};

type Props = {
  dict: Dictionary["leakage_page"];
  lang: string;
};

export default function LeakageCalculator({ dict, lang }: Props) {
  const [revenue, setRevenue] = useState(250000);
  const [taxPaid, setTaxPaid] = useState(45000);
  const [premiums, setPremiums] = useState(12000);

  const leakage = useMemo(
    () => taxPaid * 0.12 + premiums * 0.15,
    [taxPaid, premiums]
  );

  const format = (n: number) =>
    new Intl.NumberFormat(
      LOCALE_MAP[(lang as Locale)] || "en-US",
      {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <h2 className={styles.inputsTitle}>{dict.inputs_title}</h2>

          <label className={styles.label}>
            <span>{dict.revenue_label}</span>
            <span className={styles.value}>{format(revenue)}</span>
            <input
              type="range"
              min={50000}
              max={5000000}
              step={10000}
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className={styles.slider}
            />
          </label>

          <label className={styles.label}>
            <span>{dict.tax_label}</span>
            <span className={styles.value}>{format(taxPaid)}</span>
            <input
              type="range"
              min={5000}
              max={1500000}
              step={1000}
              value={taxPaid}
              onChange={(e) => setTaxPaid(Number(e.target.value))}
              className={styles.slider}
            />
          </label>

          <label className={styles.label}>
            <span>{dict.premiums_label}</span>
            <span className={styles.value}>{format(premiums)}</span>
            <input
              type="range"
              min={1000}
              max={200000}
              step={500}
              value={premiums}
              onChange={(e) => setPremiums(Number(e.target.value))}
              className={styles.slider}
            />
          </label>
        </div>

        <div className={styles.outputs}>
          <div className={`${styles.panel} ${styles.risk}`}>
            <p className={styles.panelLabel}>—</p>
            <h3 className={styles.panelTitle}>{dict.unintegrated_title}</h3>
            <p className={styles.amount}>{format(leakage)}</p>
            <p className={styles.panelSub}>{dict.unintegrated_sub}</p>
          </div>

          <div className={`${styles.panel} ${styles.savings}`}>
            <p className={styles.panelLabel}>+</p>
            <h3 className={styles.panelTitle}>{dict.integrated_title}</h3>
            <p className={styles.amount}>{format(leakage)}</p>
            <p className={styles.panelSub}>{dict.integrated_sub}</p>
          </div>

          <Button href={`/${lang}/book`} variant="primary" className={styles.cta}>
            {dict.cta}
          </Button>

          <p className={styles.disclaimer}>{dict.disclaimer}</p>
          <Link href={`/${lang}/calculator`} className={styles.pricingLink}>
            {dict.link_pricing}
          </Link>
        </div>
      </div>
    </div>
  );
}
