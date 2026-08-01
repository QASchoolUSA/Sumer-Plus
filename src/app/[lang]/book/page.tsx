import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import BookingEmbed from "@/components/BookingEmbed/BookingEmbed";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/book",
    title: `${dict.book_page.title} | SumerPlus`,
    description: dict.book_page.subtitle,
  });
}

export default async function BookPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{dict.book_page.title}</h1>
      <p className={styles.subtitle}>{dict.book_page.subtitle}</p>

      <div className={styles.terms}>
        <h2 className={styles.termsTitle}>Consultation Engagement Terms</h2>
        <p className={styles.termsLead}>
          Booking confirms that you have reviewed and agreed to these terms.
        </p>

        <h3 className={styles.termsHeading}>Scope of Services</h3>
        <p className={styles.termsText}>
          A paid consultation provides professional guidance and answers to your
          questions related to tax matters, bookkeeping, insurance strategy, and
          general tax optimization. Advice is based solely on the information you
          provide and limited to the time scheduled.
        </p>

        <h3 className={styles.termsHeading}>A consultation does not include:</h3>
        <ul className={styles.termsList}>
          <li>Preparation or filing of tax returns.</li>
          <li>IRS or State representation.</li>
          <li>Document preparation or bookkeeping services.</li>
          <li>
            Legal, investment, financial planning, or securities advisory
            services.
          </li>
        </ul>
        <p className={styles.termsText}>
          If additional services are needed, they will be offered separately
          under a new engagement and pricing.
        </p>

        <h3 className={styles.termsHeading}>Fee & Payment</h3>
        <p className={styles.termsText}>
          Payment is required in full prior to the consultation when applicable.
          Initial strategy and insurance advice consultations are free as
          stated. Fees are not dependent on tax outcomes, refunds, credits, or
          savings.
        </p>

        <h3 className={styles.termsHeading}>
          Rescheduling, Cancellation & Refunds
        </h3>
        <ul className={styles.termsList}>
          <li>Rescheduling 24+ hours in advance: no fee.</li>
          <li>
            Cancellations less than 24 hours prior or no-shows: non-refundable
            when a fee applies.
          </li>
        </ul>
      </div>

      <div className={styles.embedContainer}>
        <BookingEmbed />
      </div>
    </div>
  );
}
