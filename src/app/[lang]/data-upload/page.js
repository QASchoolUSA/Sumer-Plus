import ExcelDataDisplay from '@/components/ExcelDataDisplay';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function DataUploadPage({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-white">
            {/* Simple, Professional Header */}
            <div className="border-b border-slate-200">
                <div className="container mx-auto px-4 py-8 pt-24">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Data Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage terms for drivers and owners.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <ExcelDataDisplay />
            </main>
        </div>
    );
}
