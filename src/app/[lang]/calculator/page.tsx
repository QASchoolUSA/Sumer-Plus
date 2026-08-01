import type { Metadata } from "next";
import { getDictionary } from "../../../i18n/get-dictionary";
import PricingCalculator from "@/components/PricingCalculator/PricingCalculator";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import type { PageProps } from "@/types/pages";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    path: "/calculator",
    title: `${dict.calculator_page.title} | SumerPlus`,
    description: dict.calculator_page.subtitle,
  });
}

export default async function CalculatorPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="py-16 px-4 min-h-screen" style={{ background: "var(--color-background)" }}>
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-primary)",
            letterSpacing: "0.06em",
          }}
        >
          {dict.calculator_page.title}
        </h1>
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          {dict.calculator_page.subtitle}
        </p>
        <p className="mt-4">
          <Link
            href={`/${lang}/leakage`}
            className="underline underline-offset-4"
            style={{ color: "var(--color-primary)" }}
          >
            {dict.calculator_page.leakage_link}
          </Link>
        </p>
      </div>
      <PricingCalculator dict={dict} lang={lang} />
    </div>
  );
}
