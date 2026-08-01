"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { i18n, type Locale } from "../../i18n-config";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = {
  dict: Dictionary["navigation"];
  lang: string;
};

export default function Header({ dict, lang }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const close = () => {
    setIsMenuOpen(false);
    setToolsOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={`/${lang}`} className={styles.logo} onClick={close}>
          <Image
            src="/brand/logo-128.webp"
            alt="SumerPlus"
            width={48}
            height={48}
            className={styles.logoImg}
            priority
            unoptimized
            style={{ background: "transparent" }}
          />
          <span className={styles.logoText}>SUMERPLUS</span>
        </Link>

        <button
          className={styles.mobileToggle}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}
          />
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link href={`/${lang}`} className={styles.navLink} onClick={close}>
                {dict.home}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/services`}
                className={styles.navLink}
                onClick={close}
              >
                {dict.services}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/insurance`}
                className={styles.navLink}
                onClick={close}
              >
                {dict.insurance}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/about`}
                className={styles.navLink}
                onClick={close}
              >
                {dict.about}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/faq`}
                className={styles.navLink}
                onClick={close}
              >
                {dict.faq}
              </Link>
            </li>
            <li className={styles.dropdown}>
              <button
                type="button"
                className={styles.navLink}
                onClick={() => setToolsOpen(!toolsOpen)}
                aria-expanded={toolsOpen}
              >
                {dict.tools}
              </button>
              <ul
                className={`${styles.dropdownMenu} ${toolsOpen ? styles.dropdownOpen : ""}`}
              >
                <li>
                  <Link
                    href={`/${lang}/calculator`}
                    className={styles.dropdownLink}
                    onClick={close}
                  >
                    {dict.calculator}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${lang}/leakage`}
                    className={styles.dropdownLink}
                    onClick={close}
                  >
                    {dict.leakage}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                href={`/${lang}/contact`}
                className={styles.navLink}
                onClick={close}
              >
                {dict.contact}
              </Link>
            </li>
            <li>
              <div className={styles.langSwitcher}>
                {i18n.locales.map((locale) => (
                  <Link
                    key={locale}
                    href={redirectedPathName(locale)}
                    className={`${styles.langLink} ${lang === locale ? styles.activeLang : ""}`}
                    onClick={close}
                  >
                    {locale.toUpperCase()}
                  </Link>
                ))}
              </div>
            </li>
            <li>
              <Button
                href={`/${lang}/book`}
                variant="primary"
                onClick={close}
              >
                {dict.book}
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
