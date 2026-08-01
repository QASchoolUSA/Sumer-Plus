import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./TaxFormControls.module.css";

export type FormDataMap = Record<string, string | boolean | undefined>;

export type FormChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;

type SectionWrapperProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionWrapper({
  title,
  description,
  children,
}: SectionWrapperProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {description ? (
          <p className={styles.sectionDesc}>{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

type FormGroupProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function FormGroup({ label, children, className }: FormGroupProps) {
  return (
    <div className={cn(styles.formGroup, className)}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

type Option = { label: string; value: string };

type RadioGroupProps = {
  name: string;
  options: Option[];
  value?: string;
  onChange: FormChangeHandler;
};

export function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className={styles.optionList}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(styles.option, selected && styles.optionSelected)}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={onChange}
            />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

type CheckboxOption = { label: string; name: string };

type CheckboxGroupProps = {
  options: CheckboxOption[];
  data: FormDataMap;
  prefix: string;
  onChange: FormChangeHandler;
};

export function CheckboxGroup({
  options,
  data,
  prefix,
  onChange,
}: CheckboxGroupProps) {
  return (
    <div className={styles.optionList}>
      {options.map((option) => {
        const field = `${prefix}_${option.name}`;
        const checked = Boolean(data[field]);
        return (
          <label
            key={option.name}
            className={cn(styles.option, checked && styles.optionSelected)}
          >
            <input
              type="checkbox"
              name={field}
              checked={checked}
              onChange={onChange}
            />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className={styles.callout}>{children}</div>;
}

export function InfoPanel({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.panel}>
      {title ? <p className={styles.panelTitle}>{title}</p> : null}
      {children}
    </div>
  );
}

export function FieldGrid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div className={cols === 3 ? styles.grid3 : styles.grid2}>{children}</div>
  );
}

export function GroupHeading({ children }: { children: ReactNode }) {
  return <h4 className={styles.groupHeading}>{children}</h4>;
}

export function InlineCheck({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: FormChangeHandler;
  label: string;
}) {
  return (
    <label className={styles.inlineCheck}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export function DashedButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className={styles.dashedButton} onClick={onClick}>
      {children}
    </button>
  );
}

export function MutedNote({ children }: { children: ReactNode }) {
  return <p className={styles.mutedNote}>{children}</p>;
}

export { styles as taxFormStyles };
