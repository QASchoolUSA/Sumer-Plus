import { getDictionary } from '../../../i18n/get-dictionary';
import BookingEmbedWrapper from '@/components/BookingEmbed/BookingEmbedWrapper';
import styles from './page.module.css';

export default async function Book({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{dict.book_page.title}</h1>
        <p className={styles.subtitle}>{dict.book_page.subtitle}</p>

        <div className={styles.embedWrapper}>
          <BookingEmbedWrapper />
        </div>
      </div>
    </div>
  );
}
