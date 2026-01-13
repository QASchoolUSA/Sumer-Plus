
import { getDictionary } from '../../../i18n/get-dictionary';
import BookingEmbed from '@/components/BookingEmbed/BookingEmbed';
import styles from './page.module.css';

export const metadata = {
  title: 'Book a Consultation | Sumer Plus',
  description: 'Schedule a time to speak with our experts.',
};

export default async function BookPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{dict.book_page.title}</h1>
      <p className={styles.subtitle}>{dict.book_page.subtitle}</p>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 mb-10 max-w-4xl mx-auto text-left">
        <h2 className="text-xl font-bold mb-4">Consultation Engagement Terms</h2>
        <p className="mb-4 text-sm text-slate-600">Booking confirms that you have reviewed and agreed to these terms.</p>

        <h3 className="font-semibold mt-4 mb-2">Scope of Services</h3>
        <p className="text-sm text-slate-600 mb-2">A paid consultation provides professional guidance and answers to your questions related to tax matters, bookkeeping, and general tax optimization strategies. Advice is based solely on the information you provide and limited to the time scheduled.</p>

        <h3 className="font-semibold mt-4 mb-2">A consultation does not include:</h3>
        <ul className="list-disc list-inside text-sm text-slate-600 mb-2 pl-2">
          <li>Preparation or filing of tax returns.</li>
          <li>IRS or State representation.</li>
          <li>Document preparation or bookkeeping services.</li>
          <li>Legal, investment, financial planning, or securities advisory services.</li>
        </ul>
        <p className="text-sm text-slate-600">If additional services are needed, they will be offered separately under a new engagement and pricing.</p>

        <h3 className="font-semibold mt-4 mb-2">Fee & Payment</h3>
        <p className="text-sm text-slate-600">Payment is required in full prior to the consultation. Fees are not dependent on tax outcomes, refunds, credits, or savings.</p>

        <h3 className="font-semibold mt-4 mb-2">Rescheduling, Cancellation & Refunds</h3>
        <ul className="list-disc list-inside text-sm text-slate-600 pl-2">
          <li>Rescheduling 24+ hours in advance: no fee.</li>
          <li>Cancellations less than 24 hours prior or no-shows: non-refundable.</li>
        </ul>
      </div>

      <div className={styles.embedContainer}>
        <BookingEmbed />
      </div>
    </div>
  );
}
