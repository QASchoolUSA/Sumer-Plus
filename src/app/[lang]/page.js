import { getDictionary } from '../../i18n/get-dictionary';
import Hero from '@/components/Hero/Hero';
import AboutSection from '@/components/AboutSection/AboutSection';
import styles from './page.module.css';

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.page}>
      <Hero dict={dict.hero} lang={lang} />
      <AboutSection dict={dict.about_us} />
    </div>
  );
}
