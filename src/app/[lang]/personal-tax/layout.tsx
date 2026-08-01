import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLayoutProps } from "@/types/pages";

export async function generateMetadata({
  params,
}: AppLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/personal-tax",
    title: dict.seo.personal_tax_title,
    description: dict.seo.personal_tax_description,
  });
}

export default function PersonalTaxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
