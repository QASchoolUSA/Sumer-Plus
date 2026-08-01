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
    path: "/corporate-tax",
    title: dict.seo.corporate_tax_title,
    description: dict.seo.corporate_tax_description,
  });
}

export default function CorporateTaxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
