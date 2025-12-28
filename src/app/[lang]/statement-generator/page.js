import { getDictionary } from "../../../i18n/get-dictionary";
import StatementGeneratorClient from "../../../components/StatementGenerator/StatementGeneratorClient";
import { Card } from "@/components/ui/card";

export default async function StatementGeneratorPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Simple, Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Statement Generator
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Generate PDF statements from driver and load data
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <StatementGeneratorClient lang={lang} dict={dict} />
      </main>
    </div>
  );
}
