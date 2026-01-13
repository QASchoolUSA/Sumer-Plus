
import { getDictionary } from '../../../i18n/get-dictionary';
import Button from '@/components/Button/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Services | Sumer Plus',
    description: 'Comprehensive financial solutions for every stage of your business.',
};

const SERVICES_DATA = [
    {
        id: "personal-tax",
        title: "Personal Tax Return",
        subtitle: "Accurate and compliant personal tax preparation services maximizing your refund and reducing your tax burden legally.",
        description: "Every tax return is prepared with accuracy, thorough documentation, and good-faith interpretation of tax law. Our goal is to help you stay fully compliant while uncovering every opportunity to maximize your refund or reduce your tax burden legally.",
        features: [
            "Handling of simple W-2 to complex investments and self-employment",
            "Review of financial documents for all deductions and credits",
            "Up-to-date with latest regulations",
            "Support with IRS or state tax agency notices"
        ]
    },
    {
        id: "business-tax",
        title: "Business Tax Return",
        subtitle: "Hands-on, detail-driven business tax preparation for corporations, partnerships, and self-employed individuals.",
        description: "Accurate business tax filing is essential for compliance and financial health. We handle Forms 1120, 1120-S, 1065, and Schedule C. We not only prepare your return but also analyze your financial statements to identify tax-saving opportunities.",
        features: [
            "Preparation of Forms 1120, 1120-S, 1065, Schedule C",
            "Financial statement analysis for tax savings",
            "Proper classification of expenses",
            "Tax selection guidance (S-Corp, etc.)"
        ]
    },
    {
        id: "bookkeeping",
        title: "Accounting & Bookkeeping",
        subtitle: "Professional bookkeeping and financial reporting.",
        description: "Professional bookkeeping and financial reporting, delivered at a predictable and simple monthly cost. accurate books are the foundation of any successful business.",
        features: [
            "Accurate Categorization: Every transaction coded correctly",
            "Bank Reconciliation: Monthly reconciliation of accounts",
            "Monthly Reports: Timely financial statements",
            "Quarterly Reviews: Periodic analysis"
        ]
    },
    {
        id: "reinstatement",
        title: "Books & Financial Records Reinstatement",
        subtitle: "Get your financials back on track.",
        description: "Restore clarity and confidence in your financials. We clean up and reinstate neglected or outdated books, ensuring full readiness for tax season, lender evaluations, or audit requirements.",
        features: [
            "Historical Reconstruction of missing transactions",
            "Error Correction and discrepancy resolution",
            "Full Reconciliation of all accounts",
            "Reporting Readiness for tax filing"
        ]
    },
    {
        id: "estimated-tax",
        title: "Estimated Tax",
        subtitle: "Stay ahead of your tax obligations.",
        description: "The IRS requires self-employed taxpayers to pay taxes quarterly. We determine accurate quarterly amounts for you and guide you through the schedule to avoid penalties.",
        features: [
            "Quarterly Calculation based on income trends",
            "Cash-Flow Planning advice",
            "Deadline Tracking",
            "Remittance Scheduling"
        ]
    },
    {
        id: "tax-planning",
        title: "Tax Optimization & Planning",
        subtitle: "Proactive strategies to legally minimize your tax liability.",
        description: "Effective tax strategy is built on proactive planning, not last-minute fixes. We work with you throughout the year to identify deductions, credits, and strategies that fit your specific financial situation.",
        features: [
            "Year-Round Planning",
            "Entity Alignment checks",
            "Retirement & Benefits strategy",
            "Credits & Deductions identification"
        ]
    },
    {
        id: "payroll",
        title: "Payroll Setup & Maintenance",
        subtitle: "Accurate, compliant, and stress-free payroll solutions.",
        description: "We take care of the entire process for you, from setup to ongoing maintenance, making sure everything is accurate, compliant, and reported correctly. Setup starts at $150, monthly service from $50/mo.",
        features: [
            "Software configuration and employee onboarding",
            "Pay schedule setup and direct deposit",
            "Quarterly and annual compliance filings (W-2, etc)",
            "PTO tracking and reporting"
        ]
    },
    {
        id: "1099",
        title: "1099 Preparation & Filing",
        subtitle: "Compliance made simple for your contractors.",
        description: "We provide fast, accurate 1099 filing for your contractors, including preparation, IRS submission, and recipient copies. Avoid penalties with our streamlined service.",
        features: [
            "Contractor Data Validation",
            "Form Preparation (1099-NEC, etc)",
            "IRS E-Filing",
            "Delivery of recipient copies"
        ]
    },
    {
        id: "sales-tax",
        title: "Sales Tax",
        subtitle: "Accurate multi-state sales tax compliance.",
        description: "We help ensure you’re charging, tracking, and remitting sales tax correctly, no matter how complex your sales channels are. From local to nationwide online sales.",
        features: [
            "Multi-State Nexus Assessment",
            "Platform Integration (Shopify, Amazon, etc)",
            "Filing & Remittance",
            "Audit Readiness"
        ]
    },
    {
        id: "formation",
        title: "New Business Entity Formation",
        subtitle: "Start your business on the right foundation.",
        description: "We help you choose the right structure, file the required documents, and set up your business properly from day one to avoid costly restructuring later.",
        features: [
            "Entity Selection (LLC, S-Corp, etc)",
            "EIN & State Registrations",
            "IRS Elections (like S-Corp status)",
            "Initial Books Setup"
        ]
    }
];

export default async function ServicesPage({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="bg-white">
            <div className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Services</h1>
                    <p className="mt-4 text-xl text-slate-300">
                        Comprehensive financial solutions tailored to your success.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-12 lg:gap-16">
                    {SERVICES_DATA.map((service, idx) => (
                        <div key={service.id} id={service.id} className={`flex flex-col lg:flex-row gap-8 items-start ${idx !== 0 ? 'pt-12 border-t border-slate-100' : ''}`}>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h2>
                                <p className="text-lg text-blue-600 font-medium mb-4">{service.subtitle}</p>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {service.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button href={`/${lang}/book`} variant="primary">
                                    Book Consultation
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
