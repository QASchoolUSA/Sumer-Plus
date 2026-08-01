import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import BrandButton from "@/components/Button/Button";
import styles from "./TaxWizardShell.module.css";

type Props = {
  title: string;
  subtitle: string;
  stepTitle: string;
  stepIndex: number;
  stepCount: number;
  progress: number;
  children: ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export default function TaxWizardShell({
  title,
  subtitle,
  stepTitle,
  stepIndex,
  stepCount,
  progress,
  children,
  onPrev,
  onNext,
  onSubmit,
  submitting = false,
}: Props) {
  const isLast = stepIndex === stepCount - 1;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Questionnaire progress"
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.stepTitle}>{stepTitle}</h2>
              <p className={styles.stepMeta}>
                Step {stepIndex + 1} of {stepCount}
              </p>
            </div>
            <span className={styles.percent}>
              {Math.round(progress)}% completed
            </span>
          </div>

          <div className={styles.cardBody}>{children}</div>

          <div className={styles.cardFooter}>
            <BrandButton
              type="button"
              variant="outline"
              onClick={onPrev}
              disabled={stepIndex === 0}
              className={styles.navButton}
            >
              <ChevronLeft size={16} aria-hidden />
              Previous
            </BrandButton>

            <div className={styles.footerActions}>
              {isLast ? (
                <BrandButton
                  type="button"
                  variant="primary"
                  onClick={onSubmit}
                  disabled={submitting}
                  className={styles.navButton}
                >
                  {submitting ? "Submitting…" : "Submit Questionnaire"}
                  <Check size={16} aria-hidden />
                </BrandButton>
              ) : (
                <BrandButton
                  type="button"
                  variant="primary"
                  onClick={onNext}
                  className={styles.navButton}
                >
                  Next
                  <ChevronRight size={16} aria-hidden />
                </BrandButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
