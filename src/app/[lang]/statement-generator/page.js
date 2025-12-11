import { getDictionary } from "../../../i18n/get-dictionary";
import StatementGeneratorClient from "../../../components/StatementGenerator/StatementGeneratorClient";

export default async function StatementGeneratorPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <StatementGeneratorClient lang={lang} dict={dict} />;
}
