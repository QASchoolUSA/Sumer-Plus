import ExcelDataDisplay from '@/components/ExcelDataDisplay';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function DataUploadPage({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Space */}
            <div className="h-24 bg-[#001f3f]"></div>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-[#001f3f] mb-4 text-center">
                        Upload Driver & Owner Data
                    </h1>
                    <p className="text-gray-600 text-center mb-12">
                        Upload your Excel file to view parsed Drivers and Owners terms.
                    </p>

                    <ExcelDataDisplay />
                </div>
            </main>
        </div>
    );
}
