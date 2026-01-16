'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, Save, Upload } from 'lucide-react';

const steps = [
    { id: 'basic', title: 'Basic Info' },
    { id: 'dependents', title: 'Dependents' },
    { id: 'income', title: 'Income' },
    { id: 'adjustments', title: 'Adjustments' },
    { id: 'deductions', title: 'Deductions' },
    { id: 'credits', title: 'Credits' },
    { id: 'education', title: 'Education' },
    { id: 'retirement', title: 'Retirement' },
    { id: 'health', title: 'Health' },
    { id: 'foreign', title: 'Foreign & Digital' },
    { id: 'estimated', title: 'Estimated Tax' },
    { id: 'life_events', title: 'Life Events' },
    { id: 'banking', title: 'Banking & Filing' },
];

export default function PersonalTaxPage() {
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

    const [isSubmitted, setIsSubmitted] = useState(false);

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Card className="max-w-xl w-full text-center p-8 shadow-xl border-green-100">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl mb-4 text-slate-900">Thank You!</CardTitle>
                    <CardDescription className="text-lg text-slate-600 mb-8">
                        Your Personal Tax Questionnaire has been successfully submitted. We have received your information and will review it shortly.
                    </CardDescription>
                    <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto">
                        Return to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Personal Tax Questionnaire</h1>
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
                                                body: JSON.stringify({ type: 'Personal', data: formData }),
                                            });
                                            if (response.ok) {
                                                setIsSubmitted(true);
                                                window.scrollTo(0, 0);
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
        case 0: return <BasicInfoSection data={data} onChange={handleChange} />;
        case 1: return <DependentsSection data={data} onChange={handleChange} />;
        case 2: return <IncomeSection data={data} onChange={handleChange} />;
        case 3: return <AdjustmentsSection data={data} onChange={handleChange} />;
        case 4: return <DeductionsSection data={data} onChange={handleChange} />;
        case 5: return <CreditsSection data={data} onChange={handleChange} />;
        case 6: return <EducationSection data={data} onChange={handleChange} />;
        case 7: return <RetirementSection data={data} onChange={handleChange} />;
        case 8: return <HealthSection data={data} onChange={handleChange} />;
        case 9: return <ForeignSection data={data} onChange={handleChange} />;
        case 10: return <EstimatedTaxSection data={data} onChange={handleChange} />;
        case 11: return <LifeEventsSection data={data} onChange={handleChange} />;
        case 12: return <BankingSection data={data} onChange={handleChange} />;
        default: return <div>Unknown Step</div>;
    }
}

// --- Section Components ---

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


const BasicInfoSection = ({ data, onChange }) => (
    <SectionWrapper
        title="Taxpayer Information"
        description="This section establishes your legal identity for tax purposes."
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Full Name">
                <Input name="fullName" value={data.fullName || ''} onChange={onChange} placeholder="John Doe" />
            </FormGroup>
            <FormGroup label="Spouse Name (if applicable)">
                <Input name="spouseName" value={data.spouseName || ''} onChange={onChange} placeholder="Jane Doe" />
            </FormGroup>
            <FormGroup label="SSN / ITIN">
                <Input name="ssn" value={data.ssn || ''} onChange={onChange} placeholder="000-00-0000" />
            </FormGroup>
            <FormGroup label="Date of Birth">
                <Input name="dob" type="date" value={data.dob || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Address" className="md:col-span-2">
                <Input name="address" value={data.address || ''} onChange={onChange} placeholder="123 Main St, City, State, Zip" />
            </FormGroup>
        </div>

        <FormGroup label="Filing Status (as of Dec 31, 2025)">
            <RadioGroup
                name="filingStatus"
                value={data.filingStatus}
                onChange={onChange}
                options={[
                    { label: 'Single', value: 'single' },
                    { label: 'Married Filing Jointly', value: 'married_joint' },
                    { label: 'Married Filing Separately', value: 'married_separate' },
                    { label: 'Head of Household', value: 'head_household' },
                    { label: 'Qualifying Surviving Spouse', value: 'surviving_spouse' },
                ]}
            />
        </FormGroup>

        <FormGroup label="Did you move during 2025?">
            <RadioGroup
                name="moved2025"
                value={data.moved2025}
                onChange={onChange}
                options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ]}
            />
        </FormGroup>
    </SectionWrapper>
);

const DependentsSection = ({ data, onChange }) => (
    <SectionWrapper title="Dependents" description="List all dependents you wish to claim.">
        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700 mb-4">
            Purpose: Determines eligibility for Child Tax Credit, Other Dependent Credit, and Head of Household status.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-slate-50">
            <FormGroup label="Name">
                <Input name="dep1_name" value={data.dep1_name || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="SSN">
                <Input name="dep1_ssn" value={data.dep1_ssn || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Relationship">
                <Input name="dep1_rel" value={data.dep1_rel || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Date of Birth">
                <Input type="date" name="dep1_dob" value={data.dep1_dob || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Months Lived with You">
                <Input type="number" name="dep1_months" value={data.dep1_months || ''} onChange={onChange} />
            </FormGroup>
            <div className="flex items-center space-x-2 pt-8">
                <input type="checkbox" name="dep1_student" checked={data.dep1_student || false} onChange={onChange} className="h-4 w-4" />
                <span className="text-sm">Student?</span>
            </div>
        </div>
        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => alert("Add dependent logic would go here")}>
            + Add Another Dependent
        </Button>
    </SectionWrapper>
);

const IncomeSection = ({ data, onChange }) => (
    <SectionWrapper title="Income" description="IRS requires reporting of all worldwide income.">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mt-4">Employment & Business</h4>
        <CheckboxGroup
            prefix="income"
            data={data}
            onChange={onChange}
            options={[
                { label: 'W-2 Wages (Employee Income)', name: 'w2' },
                { label: '1099-NEC / Consulting Income', name: '1099nec' },
                { label: 'Business Income or Loss (Schedule C)', name: 'schedulec' },
                { label: 'Tips, Bonuses, Commissions', name: 'tips' },
            ]}
        />

        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mt-6">Investment & Other</h4>
        <CheckboxGroup
            prefix="income"
            data={data}
            onChange={onChange}
            options={[
                { label: 'Interest (1099-INT)', name: 'interest' },
                { label: 'Dividends (1099-DIV)', name: 'dividends' },
                { label: 'Capital Gains/Losses (Stocks, Crypto, Property)', name: 'capital_gains' },
                { label: 'Rental Income', name: 'rental' },
                { label: 'Royalties', name: 'royalties' },
                { label: 'Unemployment Compensation', name: 'unemployment' },
                { label: 'Social Security Benefits', name: 'social_security' },
                { label: 'Retirement Distributions (IRA, 401k, Pension)', name: 'retirement_dist' },
            ]}
        />
    </SectionWrapper>
);

const AdjustmentsSection = ({ data, onChange }) => (
    <SectionWrapper title="Adjustments to Income" description="Reduces Adjusted Gross Income (AGI).">
        <CheckboxGroup
            prefix="adj"
            data={data}
            onChange={onChange}
            options={[
                { label: 'Traditional IRA Contributions', name: 'ira' },
                { label: 'Health Savings Account (HSA) Contributions', name: 'hsa' },
                { label: 'Student Loan Interest Paid', name: 'student_loan' },
                { label: 'Self-Employed Health Insurance Premiums', name: 'se_health' },
                { label: 'Self-Employed Retirement (SEP, SIMPLE, Solo 401k)', name: 'se_retirement' },
                { label: 'Alimony Paid (pre-2019 agreements)', name: 'alimony' },
            ]}
        />
    </SectionWrapper>
);

const DeductionsSection = ({ data, onChange }) => (
    <SectionWrapper title="Deductions" description="Standard vs Itemized Deductions.">
        <div className="bg-slate-100 p-4 rounded-md mb-4 text-sm">
            <h4 className="font-semibold mb-1">Standard Deduction (2025 Ref)</h4>
            <p>Single/MFS: $15,000 | MFJ: $30,000 | Head of Household: $22,500</p>
        </div>
        <p className="text-sm font-medium">Check any Itemized Deductions you might have:</p>
        <CheckboxGroup
            prefix="deduct"
            data={data}
            onChange={onChange}
            options={[
                { label: 'Medical Expenses (>7.5% of AGI)', name: 'medical' },
                { label: 'State & Local Taxes (SALT) - Income/Sales + Property', name: 'salt' },
                { label: 'Mortgage Interest', name: 'mortgage' },
                { label: 'Charitable Contributions (Cash/Non-Cash)', name: 'charity' },
                { label: 'Casualty & Theft Losses (Federally Declared Disaster)', name: 'casualty' },
            ]}
        />
    </SectionWrapper>
);

const CreditsSection = ({ data, onChange }) => (
    <SectionWrapper title="Tax Credits" description="Directly reduce tax liability.">
        <CheckboxGroup
            prefix="credit"
            data={data}
            onChange={onChange}
            options={[
                { label: 'Child Tax Credit (Children < 17)', name: 'child' },
                { label: 'Credit for Other Dependents', name: 'other_dep' },
                { label: 'Child & Dependent Care Credit (Daycare etc)', name: 'care' },
                { label: 'Education Credits (American Opportunity, Lifetime Learning)', name: 'education' },
                { label: 'Retirement Saver’s Credit', name: 'saver' },
                { label: 'Energy Credits (Solar, Heat Pumps)', name: 'energy' },
                { label: 'Electric Vehicle Credit', name: 'ev' },
                { label: 'Premium Tax Credit (Marketplace Insurance)', name: 'premium' },
            ]}
        />
    </SectionWrapper>
);

const EducationSection = ({ data, onChange }) => (
    <SectionWrapper title="Education" description="">
        <FormGroup label="Did you pay college tuition? (Form 1098-T)">
            <RadioGroup
                name="edu_tuition"
                value={data.edu_tuition}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
        <FormGroup label="Did you pay student loan interest?">
            <RadioGroup
                name="edu_loan_interest"
                value={data.edu_loan_interest}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const RetirementSection = ({ data, onChange }) => (
    <SectionWrapper title="Retirement Contributions" description="Track contributions for 2025 limits.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="401(k) / 403(b) Contributions">
                <Input type="number" name="ret_401k" value={data.ret_401k || ''} onChange={onChange} placeholder="$" />
            </FormGroup>
            <FormGroup label="IRA (Traditional/Roth)">
                <Input type="number" name="ret_ira" value={data.ret_ira || ''} onChange={onChange} placeholder="$" />
            </FormGroup>
            <FormGroup label="HSA Contributions">
                <Input type="number" name="ret_hsa" value={data.ret_hsa || ''} onChange={onChange} placeholder="$" />
            </FormGroup>
        </div>
    </SectionWrapper>
);

const HealthSection = ({ data, onChange }) => (
    <SectionWrapper title="Health Insurance">
        <FormGroup label="Were you covered by health insurance all year?">
            <RadioGroup
                name="health_covered"
                value={data.health_covered}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
        <FormGroup label="Did you have Marketplace Insurance (Form 1095-A)?">
            <RadioGroup
                name="health_marketplace"
                value={data.health_marketplace}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const ForeignSection = ({ data, onChange }) => (
    <SectionWrapper title="Foreign & Digital Assets" description="High-penalty reporting areas.">
        <FormGroup label="Do you have foreign bank accounts (FBAR)?">
            <RadioGroup
                name="for_fbar"
                value={data.for_fbar}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
        <FormGroup label="Did you have cryptocurrency transactions (Buy/Sell/Exchange)?">
            <RadioGroup
                name="for_crypto"
                value={data.for_crypto}
                onChange={onChange}
                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
            />
        </FormGroup>
    </SectionWrapper>
);

const EstimatedTaxSection = ({ data, onChange }) => (
    <SectionWrapper title="Estimated Tax Payments">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Federal Estimated Taxes Paid">
                <Input type="number" name="est_fed" value={data.est_fed || ''} onChange={onChange} placeholder="$" />
            </FormGroup>
            <FormGroup label="State Estimated Taxes Paid">
                <Input type="number" name="est_state" value={data.est_state || ''} onChange={onChange} placeholder="$" />
            </FormGroup>
        </div>
    </SectionWrapper>
);

const LifeEventsSection = ({ data, onChange }) => (
    <SectionWrapper title="Life Events" description="Identify special tax rules.">
        <CheckboxGroup
            prefix="life"
            data={data}
            onChange={onChange}
            options={[
                { label: 'Marriage or Divorce', name: 'marriage_divorce' },
                { label: 'Birth or Adoption', name: 'birth_adoption' },
                { label: 'Job Change', name: 'job_change' },
                { label: 'Business Started or Closed', name: 'business_change' },
                { label: 'Home Purchase or Sale', name: 'home_change' },
                { label: 'Disaster or Major Medical Event', name: 'disaster' },
            ]}
        />
    </SectionWrapper>
);

const BankingSection = ({ data, onChange }) => (
    <SectionWrapper title="Banking & Filing" description="For direct deposit and authorization.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Bank Name">
                <Input name="bank_name" value={data.bank_name || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Routing Number">
                <Input name="bank_routing" value={data.bank_routing || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup label="Account Number">
                <Input name="bank_account" value={data.bank_account || ''} onChange={onChange} />
            </FormGroup>
        </div>
    </SectionWrapper>
);
