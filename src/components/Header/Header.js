"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../Button/Button';
import styles from './Header.module.css';
import { i18n } from '../../i18n-config';
import { ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';

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

                        {/* Functions Dropdown */}
                        <li className="relative group">
                            <button className={`${styles.navLink} flex items-center gap-1 cursor-pointer focus:outline-none`}>
                                Functions
                                <ChevronDown className="h-4 w-4 opacity-50 transition-transform group-hover:rotate-180" />
                            </button>

                            {/* Desktop Dropdown */}
                            <div className="absolute top-full left-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                                <div className="p-1">
                                    <Link
                                        href={`/${lang}/data-upload`}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                                            <FileSpreadsheet className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium">Data Upload</div>
                                            <div className="text-xs text-slate-500">Manage Excel data</div>
                                        </div>
                                    </Link>
                                    <Link
                                        href={`/${lang}/statement-generator`}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="p-1.5 bg-green-50 text-green-600 rounded">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium">Statements</div>
                                            <div className="text-xs text-slate-500">Generate drivers PDFs</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Submenu (Visible inline or simplified) */}
                            {isMenuOpen && (
                                <div className="md:hidden pl-4 mt-2 space-y-2 border-l-2 border-slate-100 ml-2">
                                    <Link
                                        href={`/${lang}/data-upload`}
                                        className="block py-2 text-sm text-slate-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Data Upload
                                    </Link>
                                    <Link
                                        href={`/${lang}/statement-generator`}
                                        className="block py-2 text-sm text-slate-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Statement Generator
                                    </Link>
                                </div>
                            )}
                        </li>

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
