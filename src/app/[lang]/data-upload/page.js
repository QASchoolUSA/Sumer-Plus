import ExcelDataDisplay from '@/components/ExcelDataDisplay';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function DataUploadPage({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-white">
            {/* Professional Minimal Header */}
            <div className="bg-white border-b border-gray-100 pb-16 pt-32 px-4 relative">
                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Data Management
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                        Upload and view driver and owner compensation terms.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 -mt-8 pb-20 relative z-20">
                <ExcelDataDisplay />
            </main>
        </div>
    );
}
