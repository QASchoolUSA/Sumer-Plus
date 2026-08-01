import type { Metadata } from "next";
import { getDictionary } from "../../i18n/get-dictionary";
import Hero from "@/components/Hero/Hero";
import BrandPillars from "@/components/BrandPillars/BrandPillars";
import CoreEngines from "@/components/CoreEngines/CoreEngines";
import AutonomyBlock from "@/components/AutonomyBlock/AutonomyBlock";
import AboutSection from "@/components/AboutSection/AboutSection";
import ValueAdvantage from "@/components/ValueAdvantage/ValueAdvantage";
import CTASection from "@/components/CTASection/CTASection";
import Button from "@/components/Button/Button";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "",
    title: dict.seo.home_title,
    description: dict.seo.home_description,
  });
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.page}>
      <Hero dict={dict.hero} lang={lang} />
      <BrandPillars dict={dict.pillars} />
      <CoreEngines dict={dict.engines} />
      <AutonomyBlock dict={dict.autonomy} />

      <section className={styles.crossover}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{dict.crossover.title}</h2>
          <p className={styles.sectionSub}>{dict.crossover.subtitle}</p>
          <div className={styles.crossGrid}>
            {dict.crossover.items.map((item, i) => (
              <div key={i} className={styles.crossItem}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.crossCta}>
            <Button href={`/${lang}/insurance`} variant="secondary">
              {dict.navigation.insurance}
            </Button>
            <Button href={`/${lang}/services`} variant="outline">
              {dict.navigation.services}
            </Button>
          </div>
        </div>
      </section>

      <ValueAdvantage dict={dict.value_advantage} />
      <AboutSection dict={dict.about_us} />
      <CTASection dict={dict.cta_section} lang={lang} />
    </div>
  );
}
