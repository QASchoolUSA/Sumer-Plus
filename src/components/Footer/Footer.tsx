import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import styles from "./Footer.module.css";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SITE, formatSiteAddress } from "@/lib/site";

type Props = {
  dict: Dictionary["footer"];
  nav?: Dictionary["navigation"];
  lang: string;
};

export default function Footer({ dict, nav, lang }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href={`/${lang}`} className={styles.brandLink}>
              <Image
                src="/brand/logo-128.webp"
                alt="SumerPlus"
                width={56}
                height={56}
                className={styles.logoImg}
                unoptimized
                style={{ background: "transparent" }}
              />
              <div>
                <p className={styles.logo}>SUMERPLUS</p>
                <p className={styles.legal}>{dict.legal_name}</p>
              </div>
            </Link>
            <p className={styles.tagline}>{dict.tagline}</p>
          </div>

          <div className={styles.links}>
            <h2 className={styles.heading}>{dict.quick_links}</h2>
            <ul>
              <li>
                <Link href={`/${lang}`}>{dict.home}</Link>
              </li>
              <li>
                <Link href={`/${lang}/services`}>{dict.services}</Link>
              </li>
              <li>
                <Link href={`/${lang}/insurance`}>{dict.insurance}</Link>
              </li>
              <li>
                <Link href={`/${lang}/about`}>{dict.about}</Link>
              </li>
              <li>
                <Link href={`/${lang}/faq`}>{dict.faq}</Link>
              </li>
              <li>
                <Link href={`/${lang}/calculator`}>{dict.calculator}</Link>
              </li>
              <li>
                <Link href={`/${lang}/leakage`}>{dict.leakage}</Link>
              </li>
              <li>
                <Link href={`/${lang}/book`}>{dict.book}</Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`}>{dict.contact}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.links}>
            <h2 className={styles.heading}>{dict.client_portals}</h2>
            <ul>
              <li>
                <Link href={`/${lang}/personal-tax`}>
                  {nav?.personal_tax || "Personal Tax"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/corporate-tax`}>
                  {nav?.corporate_tax || "Corporate Tax"}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.contact}>
            <h2 className={styles.heading}>{dict.contact}</h2>
            <p>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <p>
              <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
            </p>
            <p className={styles.address}>{formatSiteAddress(true)}</p>
            <p>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Instagram size={16} aria-hidden />
                <span>
                  {dict.instagram} @{SITE.instagramHandle}
                </span>
              </a>
            </p>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>
            &copy; {new Date().getFullYear()} {dict.legal_name}. {dict.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
