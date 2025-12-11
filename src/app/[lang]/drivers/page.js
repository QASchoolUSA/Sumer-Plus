import { getDictionary } from "../../../i18n/get-dictionary";
import DriverConfigClient from "../../../components/DriverConfig/DriverConfigClient";

export default async function DriversPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <DriverConfigClient />;
}
