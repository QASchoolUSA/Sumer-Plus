import { Inter } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getDictionary } from "../../i18n/get-dictionary";
import "../globals.css";
import styles from "./layout.module.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Sumer Plus | Tax & Business Services",
  description: "Professional tax assistance for individuals and businesses. Book your consultation today.",
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }, { lang: 'ru' }]
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={`${inter.variable}`}>
        <div className={styles.container}>
          <Header dict={dict.navigation} lang={lang} />
          <main className={styles.main}>{children}</main>
          <Footer dict={dict.footer} lang={lang} />
        </div>
      </body>
    </html>
  );
}
