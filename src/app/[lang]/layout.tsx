import type { Metadata } from "next";
import { Cinzel, IBM_Plex_Sans } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import JsonLd from "@/components/JsonLd/JsonLd";
import { getDictionary } from "../../i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import type { AppLayoutProps } from "@/types/pages";
import "../globals.css";
import styles from "./layout.module.css";

const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-ibm-plex",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: AppLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "",
    title: dict.seo.site_title,
    description: dict.seo.site_description,
  });
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }, { lang: "ru" }];
}

export default async function RootLayout({ children, params }: AppLayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: SITE.name,
    legalName: dict.footer.legal_name,
    url: SITE.url,
    logo: `${SITE.url}${SITE.logoPath}`,
    image: `${SITE.url}${SITE.ogImagePath}`,
    email: SITE.email,
    telephone: SITE.phoneTel,
    description: dict.seo.site_description,
    sameAs: [SITE.instagramUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "Tax planning",
      "Accounting",
      "Bookkeeping",
      "Insurance brokerage",
      "Group employee benefits",
      "Life insurance",
      "Florida 2-15 Life and Health",
    ],
    inLanguage: ["en", "es", "ru"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <html lang={lang} className="dark">
      <body className={`${cinzel.variable} ${ibmPlex.variable}`}>
        <JsonLd data={[orgSchema, websiteSchema]} />
        <div className={styles.container}>
          <Header dict={dict.navigation} lang={lang} />
          <main className={styles.main}>{children}</main>
          <Footer dict={dict.footer} nav={dict.navigation} lang={lang} />
        </div>
      </body>
    </html>
  );
}
