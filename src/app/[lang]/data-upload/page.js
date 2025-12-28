import ExcelDataDisplay from '@/components/ExcelDataDisplay';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function DataUploadPage({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-white">
            {/* Premium Header Background */}
            <div className="bg-[#001f3f] pb-24 pt-32 px-4 shadow-lg relative overflow-hidden">
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl"></div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-center">
                        Driver & Owner Data Portal
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl text-center max-w-2xl mx-auto leading-relaxed">
                        Securely upload your Excel data to instantly view and manage driver and owner terms.
                    </p>
                </div>
            </div>

            {/* Main Content Card - Floating effect */}
            <main className="container mx-auto px-4 -mt-16 pb-20 relative z-20">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
                    <ExcelDataDisplay />
                </div>
            </main>
        </div>
    );
}
