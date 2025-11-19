"use client";

import { useState } from 'react';
import Link from 'next/link';
import Button from '../Button/Button';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
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
                        <li><Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link href="/services" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Services</Link></li>
                        <li><Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                        <li>
                            <Button href="/book" variant="secondary" onClick={() => setIsMenuOpen(false)}>
                                Book Now
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
