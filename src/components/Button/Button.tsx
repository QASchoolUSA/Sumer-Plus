import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "outline";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  target?: string;
  rel?: string;
  external?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  target,
  rel,
  external = false,
  onClick,
  ...props
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  if (href) {
    const finalTarget = target ?? (external ? "_blank" : undefined);
    const finalRel =
      rel ??
      (external || finalTarget === "_blank" ? "noopener noreferrer" : undefined);

    return (
      <Link
        href={href}
        className={buttonClass}
        target={finalTarget}
        rel={finalRel}
        onClick={onClick as any}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
