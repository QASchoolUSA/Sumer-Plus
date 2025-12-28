import ExcelDataDisplay from '@/components/ExcelDataDisplay';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function DataUploadPage({ params }) {
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
                            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
                                Data Management
                            </h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Driver & owner compensation terms
                            </p>
                        </div>
                        {/* Optional: Add actions here later */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <ExcelDataDisplay />
            </main>
        </div>
    );
}
