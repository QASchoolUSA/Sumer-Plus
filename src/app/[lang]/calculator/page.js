
import { getDictionary } from '../../../i18n/get-dictionary';
import PricingCalculator from '@/components/PricingCalculator/PricingCalculator';

export const metadata = {
    title: 'Pricing Calculator | Sumer Plus',
    description: 'Estimate your tax preparation or bookkeeping costs.',
};

export default async function CalculatorPage({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="py-16 px-4 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{dict.navigation.calculator}</h1>
                <p className="text-lg text-slate-600">
                    Get an instant estimate for your tax preparation or bookkeeping needs.
                </p>
            </div>
            <PricingCalculator dict={dict} lang={lang} />
        </div>
    );
}
