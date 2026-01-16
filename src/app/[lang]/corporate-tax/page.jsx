'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, Save } from 'lucide-react';

const steps = [
    { id: 'company', title: 'Company Info' },
    { id: 'ownership', title: 'Ownership & Equity' },
    { id: 'services', title: 'Nature of Services' },
    { id: 'revenue', title: 'Revenue' },
    { id: 'salt', title: 'State & Local Tax' },
    { id: 'sales_tax', title: 'Sales Tax' },
    { id: 'payroll', title: 'Payroll' },
    { id: 'contractors', title: 'Contractors' },
    { id: 'expenses', title: 'Expenses' },
    { id: 'assets', title: 'Assets' },
    { id: 'financing', title: 'Financing' },
    { id: 'federal', title: 'Federal Tax' },
    { id: 'international', title: 'International' },
    { id: 'compliance', title: 'Compliance' },
];

export default function CorporateTaxPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(curr => curr + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
            window.scrollTo(0, 0);
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Corporate Tax Questionnaire</h1>
                    <p className="text-slate-500">2025 Tax Year</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Form Card */}
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="border-b border-slate-100 bg-white/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                                <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
                            </div>
                            <div className="text-sm font-medium text-slate-500 hidden sm:block">
                                {Math.round(progress)}% Completed
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {renderStepContent(currentStep, formData, handleInputChange)}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-slate-100 bg-slate-50/50 p-6">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => console.log('Saved', formData)}>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            {currentStep === steps.length - 1 ? (
                                <Button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch('/api/submit-form', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ type: 'Corporate', data: formData }),
                                            });
                                            if (response.ok) {
                                                alert('Questionnaire submitted successfully!');
                                            } else {
                                                alert('Failed to submit questionnaire.');
                                            }
                                        } catch (error) {
                                            console.error('Error submitting form:', error);
                                            alert('An error occurred. Please try again.');
                                        }
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Submit Questionnaire
                                    <Check className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={nextStep}>
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

function renderStepContent(step, data, handleChange) {
    switch (step) {
        case 0: return <CompanyInfoSection data={data} onChange={handleChange} />;
        case 1: return <OwnershipSection data={data} onChange={handleChange} />;
        case 2: return <ServicesSection data={data} onChange={handleChange} />;
        case 3: return <RevenueSection data={data} onChange={handleChange} />;
        case 4: return <SALTSection data={data} onChange={handleChange} />;
        case 5: return <SalesTaxSection data={data} onChange={handleChange} />;
        case 6: return <PayrollSection data={data} onChange={handleChange} />;
        case 7: return <ContractorsSection data={data} onChange={handleChange} />;
        case 8: return <ExpensesSection data={data} onChange={handleChange} />;
        case 9: return <AssetsSection data={data} onChange={handleChange} />;
        case 10: return <FinancingSection data={data} onChange={handleChange} />;
        case 11: return <FederalTaxSection data={data} onChange={handleChange} />;
        case 12: return <InternationalSection data={data} onChange={handleChange} />;
        case 13: return <ComplianceSection data={data} onChange={handleChange} />;
        default: return <div>Unknown Step</div>;
    }
}

// --- Shared Components (Duplicated for standalone capability) ---

const SectionWrapper = ({ title, description, children }) => (
    <div className="space-y-6">
        <div className="space-y-1">
            <h3 className="text-lg font-medium text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <div className="grid gap-6">
            {children}
        </div>
    </div>
);

const FormGroup = ({ label, children, className }) => (
    <div className={cn("space-y-2", className)}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </label>
        {children}
    </div>
);

const RadioGroup = ({ name, options, value, onChange }) => (
    <div className="grid gap-2">
        {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={onChange}
                    className="h-4 w-4 text-primary border-slate-300 focus:ring-primary"
                />
                <span className="text-sm font-medium">{option.label}</span>
            </label>
        ))}
    </div>
);

const CheckboxGroup = ({ options, data, prefix, onChange }) => (
    <div className="grid gap-2">
        {options.map((option) => (
            <label key={option.name} className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                    type="checkbox"
                    name={`${prefix}_${option.name}`}
                    checked={data[`${prefix}_${option.name}`] || false}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">{option.label}</span>
            </label>
        ))}
    </div>
);


// --- Section Components ---

const CompanyInfoSection = ({ data, onChange }) => (
    <SectionWrapper title="Company Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Legal Name of Entity">
                <Input name="legal_name" value={data.legal_name || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="DBA / Trade Name">
                <Input name="dba" value={data.dba || ''} onChange={onChange} />
            </FormGroup>
        </div>

        <FormGroup label="Entity Type">
            <RadioGroup
                name="entity_type"
                value={data.entity_type}
                onChange={onChange}
                options={[
                    { label: 'C-Corporation', value: 'c_corp' },
                    { label: 'S-Corporation', value: 's_corp' },
                    { label: 'Partnership', value: 'partnership' },
                    { label: 'LLC', value: 'llc' },
                ]}
            />
        </FormGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="EIN">
                <Input name="ein" value={data.ein || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="State of Incorporation">
                <Input name="inc_state" value={data.inc_state || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Date of Formation">
                <Input type="date" name="inc_date" value={data.inc_date || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Fiscal Year End">
                <Input name="fiscal_year" value={data.fiscal_year || ''} onChange={onChange} placeholder="e.g. Dec 31" />
            </FormGroup>
        </div>
        <FormGroup label="Business Address">
            <Input name="address" value={data.address || ''} onChange={onChange} />
        </FormGroup>

        <FormGroup label="Accounting Method">
            <RadioGroup
                name="accounting_method"
                value={data.accounting_method}
                onChange={onChange}
                options={[
                    { label: 'Cash', value: 'cash' },
                    { label: 'Accrual', value: 'accrual' },
                ]}
            />
        </FormGroup>
    </SectionWrapper>
);

const OwnershipSection = ({ data, onChange }) => (
    <SectionWrapper title="Ownership & Equity">
        <div className="border p-4 rounded-md space-y-4">
            <h4 className="font-medium text-sm">Owner/Shareholder 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroup label="Name">
                    <Input name="owner1_name" value={data.owner1_name || ''} onChange={onChange} />
                </FormGroup>
                <FormGroup label="Ownership %">
                    <Input name="owner1_pct" value={data.owner1_pct || ''} onChange={onChange} />
                </FormGroup>
            </div>
            <FormGroup label="Tax Residency">
                <Input name="owner1_residency" value={data.owner1_residency || ''} onChange={onChange} />
            </FormGroup>
        </div>
        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => alert("Add owner logic")}>
            + Add Another Owner
        </Button>
        <FormGroup label="Any ownership changes during the year?">
            <RadioGroup
                name="ownership_changes"
                value={data.ownership_changes}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const ServicesSection = ({ data, onChange }) => (
    <SectionWrapper title="Nature of Services">
        <FormGroup label="Description of Business">
            <Input name="business_desc" value={data.business_desc || ''} onChange={onChange} />
        </FormGroup>
        <FormGroup label="NAICS Code">
            <Input name="naics" value={data.naics || ''} onChange={onChange} />
        </FormGroup>
    </SectionWrapper>
);

const RevenueSection = ({ data, onChange }) => (
    <SectionWrapper title="Revenue">
        <FormGroup label="Total Gross Receipts">
            <Input name="gross_receipts" value={data.gross_receipts || ''} onChange={onChange} />
        </FormGroup>
        <h4 className="border-t pt-4 mt-4 font-medium">Revenue Source Breakdown</h4>
        <CheckboxGroup
            prefix="rev_source"
            data={data}
            onChange={onChange}
            options={[
                { label: 'Individuals', name: 'individuals' },
                { label: 'Businesses', name: 'businesses' },
                { label: 'Government Entities', name: 'government' },
            ]}
        />
        <FormGroup label="Any client > 20% of total revenue?">
            <RadioGroup
                name="revenue_concentration"
                value={data.revenue_concentration}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const SALTSection = ({ data, onChange }) => (
    <SectionWrapper title="State & Local Tax (SALT)">
        <FormGroup label="States where employees/offices located">
            <Input name="salt_emp_states" value={data.salt_emp_states || ''} onChange={onChange} />
        </FormGroup>
        <FormGroup label="States where services are performed">
            <Input name="salt_svc_states" value={data.salt_svc_states || ''} onChange={onChange} />
        </FormGroup>
    </SectionWrapper>
);

const SalesTaxSection = ({ data, onChange }) => (
    <SectionWrapper title="Sales Tax">
        <FormGroup label="Is company registered for sales tax in any state?">
            <RadioGroup
                name="sales_tax_reg"
                value={data.sales_tax_reg}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const PayrollSection = ({ data, onChange }) => (
    <SectionWrapper title="Payroll">
        <FormGroup label="Number of Employees">
            <Input name="num_employees" value={data.num_employees || ''} onChange={onChange} />
        </FormGroup>
        <FormGroup label="Total Gross Payroll">
            <Input name="gross_payroll" value={data.gross_payroll || ''} onChange={onChange} />
        </FormGroup>
    </SectionWrapper>
);

const ContractorsSection = ({ data, onChange }) => (
    <SectionWrapper title="Independent Contractors (1099)">
        <FormGroup label="Did you use independent contractors?">
            <RadioGroup
                name="use_contractors"
                value={data.use_contractors}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
        <FormGroup label="Were Form 1099-NEC filed on time?">
            <RadioGroup
                name="filed_1099"
                value={data.filed_1099}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const ExpensesSection = ({ data, onChange }) => (
    <SectionWrapper title="Expenses">
        <p className="text-sm text-slate-500 mb-4">Ideally, upload your P&L or Trial Balance. Enter key totals below if manual.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Rent">
                <Input name="exp_rent" value={data.exp_rent || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Software & SaaS">
                <Input name="exp_software" value={data.exp_software || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Professional Fees">
                <Input name="exp_prof_fees" value={data.exp_prof_fees || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Marketing">
                <Input name="exp_marketing" value={data.exp_marketing || ''} onChange={onChange} />
            </FormGroup>
        </div>
    </SectionWrapper>
);

const AssetsSection = ({ data, onChange }) => (
    <SectionWrapper title="Assets & Depreciation">
        <FormGroup label="Fixed assets purchased (Computers, Furniture etc)">
            <Input name="assets_purchased" value={data.assets_purchased || ''} onChange={onChange} />
        </FormGroup>
    </SectionWrapper>
);

const FinancingSection = ({ data, onChange }) => (
    <SectionWrapper title="Financing">
        <FormGroup label="Business Loans / Lines of Credit">
            <Input name="loans" value={data.loans || ''} onChange={onChange} />
        </FormGroup>
        <FormGroup label="Capital Contributions">
            <Input name="capital_contributions" value={data.capital_contributions || ''} onChange={onChange} />
        </FormGroup>
    </SectionWrapper>
);

const FederalTaxSection = ({ data, onChange }) => (
    <SectionWrapper title="Federal Tax">
        <FormGroup label="Estimated Tax Payments Made">
            <Input name="fed_est_tax" value={data.fed_est_tax || ''} onChange={onChange} />
        </FormGroup>
    </SectionWrapper>
);

const InternationalSection = ({ data, onChange }) => (
    <SectionWrapper title="International">
        <FormGroup label="Foreign Clients or Revenue?">
            <RadioGroup
                name="intl_revenue"
                value={data.intl_revenue}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
        <FormGroup label="Foreign Contractors?">
            <RadioGroup
                name="intl_contractors"
                value={data.intl_contractors}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const ComplianceSection = ({ data, onChange }) => (
    <SectionWrapper title="Compliance & Risk">
        <FormGroup label="IRS/State Audits or Notices Received?">
            <RadioGroup
                name="audits"
                value={data.audits}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);
