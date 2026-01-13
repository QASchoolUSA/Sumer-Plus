"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../Button/Button';
import styles from './Header.module.css';
import { i18n } from '../../i18n-config';


export default function Header({ dict, lang }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const redirectedPathName = (locale) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href={`/${lang}`} className={styles.logo}>
                    Sumer Plus
                </Link>

                <button
                    className={styles.mobileToggle}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}></span>
                </button>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList}>
                        <li><Link href={`/${lang}`} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>{dict.home}</Link></li>

                        <li><Link href={`/${lang}/calculator`} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>{dict.calculator}</Link></li>

                        <li><Link href={`/${lang}/services`} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>{dict.services}</Link></li>
                        <li><Link href={`/${lang}/contact`} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>{dict.contact}</Link></li>
                        <li>
                            <div className={styles.langSwitcher}>
                                {i18n.locales.map((locale) => (
                                    <Link
                                        key={locale}
                                        href={redirectedPathName(locale)}
                                        className={`${styles.langLink} ${lang === locale ? styles.activeLang : ''}`}
                                    >
                                        {locale.toUpperCase()}
                                    </Link>
                                ))}
                            </div>
                        </li>
                        <li>
                            <Button href={`/${lang}/book`} variant="secondary" onClick={() => setIsMenuOpen(false)}>
                                {dict.book}
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
