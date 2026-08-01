'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import TaxWizardShell from '@/components/TaxQuestionnaire/TaxWizardShell';
import TaxSuccess from '@/components/TaxQuestionnaire/TaxSuccess';
import {
  SectionWrapper,
  FormGroup,
  RadioGroup,
  CheckboxGroup,
  Callout,
  FieldGrid,
  GroupHeading,
  InlineCheck,
  DashedButton,
  InfoPanel,
  taxFormStyles,
  type FormDataMap,
  type FormChangeHandler,
} from '@/components/TaxQuestionnaire/TaxFormControls';

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
  const params = useParams();
  const lang = typeof params?.lang === 'string' ? params.lang : 'en';
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataMap>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange: FormChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((curr) => curr + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((curr) => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <TaxSuccess
        homeHref={`/${lang}`}
        message="Your Personal Tax Questionnaire has been successfully submitted. We have received your information and will review it shortly."
      />
    );
  }

  return (
    <TaxWizardShell
      title="Personal Tax Questionnaire"
      subtitle="2025 Tax Year"
      stepTitle={steps[currentStep].title}
      stepIndex={currentStep}
      stepCount={steps.length}
      progress={progress}
      onPrev={prevStep}
      onNext={nextStep}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {renderStepContent(currentStep, formData, handleInputChange)}
    </TaxWizardShell>
  );
}

function renderStepContent(
  step: number,
  data: FormDataMap,
  handleChange: FormChangeHandler
) {
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

type SectionProps = { data: FormDataMap; onChange: FormChangeHandler };

const str = (v: string | boolean | undefined) => (typeof v === 'string' ? v : '');

const BasicInfoSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Taxpayer Information" description="This section establishes your legal identity for tax purposes.">
    <FieldGrid>
      <FormGroup label="Full Name">
        <Input name="fullName" value={str(data.fullName)} onChange={onChange} placeholder="John Doe" />
      </FormGroup>
      <FormGroup label="Spouse Name (if applicable)">
        <Input name="spouseName" value={str(data.spouseName)} onChange={onChange} placeholder="Jane Doe" />
      </FormGroup>
      <FormGroup label="SSN / ITIN">
        <Input name="ssn" value={str(data.ssn)} onChange={onChange} placeholder="000-00-0000" />
      </FormGroup>
      <FormGroup label="Date of Birth">
        <Input name="dob" type="date" value={str(data.dob)} onChange={onChange} />
      </FormGroup>
      <FormGroup label="Address" className={taxFormStyles.span2}>
        <Input name="address" value={str(data.address)} onChange={onChange} placeholder="123 Main St, City, State, Zip" />
      </FormGroup>
    </FieldGrid>
    <FormGroup label="Filing Status (as of Dec 31, 2025)">
      <RadioGroup name="filingStatus" value={str(data.filingStatus)} onChange={onChange} options={[
        { label: 'Single', value: 'single' },
        { label: 'Married Filing Jointly', value: 'married_joint' },
        { label: 'Married Filing Separately', value: 'married_separate' },
        { label: 'Head of Household', value: 'head_household' },
        { label: 'Qualifying Surviving Spouse', value: 'surviving_spouse' },
      ]} />
    </FormGroup>
    <FormGroup label="Did you move during 2025?">
      <RadioGroup name="moved2025" value={str(data.moved2025)} onChange={onChange} options={[
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ]} />
    </FormGroup>
  </SectionWrapper>
);

const DependentsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Dependents" description="List all dependents you wish to claim.">
    <Callout>Purpose: Determines eligibility for Child Tax Credit, Other Dependent Credit, and Head of Household status.</Callout>
    <div className={taxFormStyles.panel}>
      <FieldGrid cols={3}>
        <FormGroup label="Name"><Input name="dep1_name" value={str(data.dep1_name)} onChange={onChange} /></FormGroup>
        <FormGroup label="SSN"><Input name="dep1_ssn" value={str(data.dep1_ssn)} onChange={onChange} /></FormGroup>
        <FormGroup label="Relationship"><Input name="dep1_rel" value={str(data.dep1_rel)} onChange={onChange} /></FormGroup>
        <FormGroup label="Date of Birth"><Input type="date" name="dep1_dob" value={str(data.dep1_dob)} onChange={onChange} /></FormGroup>
        <FormGroup label="Months Lived with You"><Input type="number" name="dep1_months" value={str(data.dep1_months)} onChange={onChange} /></FormGroup>
        <InlineCheck name="dep1_student" checked={Boolean(data.dep1_student)} onChange={onChange} label="Student?" />
      </FieldGrid>
    </div>
    <DashedButton onClick={() => alert('Add dependent logic would go here')}>+ Add Another Dependent</DashedButton>
  </SectionWrapper>
);

const IncomeSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Income" description="IRS requires reporting of all worldwide income.">
    <GroupHeading>Employment & Business</GroupHeading>
    <CheckboxGroup prefix="income" data={data} onChange={onChange} options={[
      { label: 'W-2 Wages (Employee Income)', name: 'w2' },
      { label: '1099-NEC / Consulting Income', name: '1099nec' },
      { label: 'Business Income or Loss (Schedule C)', name: 'schedulec' },
      { label: 'Tips, Bonuses, Commissions', name: 'tips' },
    ]} />
    <GroupHeading>Investment & Other</GroupHeading>
    <CheckboxGroup prefix="income" data={data} onChange={onChange} options={[
      { label: 'Interest (1099-INT)', name: 'interest' },
      { label: 'Dividends (1099-DIV)', name: 'dividends' },
      { label: 'Capital Gains/Losses (Stocks, Crypto, Property)', name: 'capital_gains' },
      { label: 'Rental Income', name: 'rental' },
      { label: 'Royalties', name: 'royalties' },
      { label: 'Unemployment Compensation', name: 'unemployment' },
      { label: 'Social Security Benefits', name: 'social_security' },
      { label: 'Retirement Distributions (IRA, 401k, Pension)', name: 'retirement_dist' },
    ]} />
  </SectionWrapper>
);

const AdjustmentsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Adjustments to Income" description="Reduces Adjusted Gross Income (AGI).">
    <CheckboxGroup prefix="adj" data={data} onChange={onChange} options={[
      { label: 'Traditional IRA Contributions', name: 'ira' },
      { label: 'Health Savings Account (HSA) Contributions', name: 'hsa' },
      { label: 'Student Loan Interest Paid', name: 'student_loan' },
      { label: 'Self-Employed Health Insurance Premiums', name: 'se_health' },
      { label: 'Self-Employed Retirement (SEP, SIMPLE, Solo 401k)', name: 'se_retirement' },
      { label: 'Alimony Paid (pre-2019 agreements)', name: 'alimony' },
    ]} />
  </SectionWrapper>
);

const DeductionsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Deductions" description="Standard vs Itemized Deductions.">
    <InfoPanel title="Standard Deduction (2025 Ref)">
      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Single/MFS: $15,000 | MFJ: $30,000 | Head of Household: $22,500
      </p>
    </InfoPanel>
    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
      Check any Itemized Deductions you might have:
    </p>
    <CheckboxGroup prefix="deduct" data={data} onChange={onChange} options={[
      { label: 'Medical Expenses (>7.5% of AGI)', name: 'medical' },
      { label: 'State & Local Taxes (SALT) - Income/Sales + Property', name: 'salt' },
      { label: 'Mortgage Interest', name: 'mortgage' },
      { label: 'Charitable Contributions (Cash/Non-Cash)', name: 'charity' },
      { label: 'Casualty & Theft Losses (Federally Declared Disaster)', name: 'casualty' },
    ]} />
  </SectionWrapper>
);

const CreditsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Tax Credits" description="Directly reduce tax liability.">
    <CheckboxGroup prefix="credit" data={data} onChange={onChange} options={[
      { label: 'Child Tax Credit (Children < 17)', name: 'child' },
      { label: 'Credit for Other Dependents', name: 'other_dep' },
      { label: 'Child & Dependent Care Credit (Daycare etc)', name: 'care' },
      { label: 'Education Credits (American Opportunity, Lifetime Learning)', name: 'education' },
      { label: "Retirement Saver's Credit", name: 'saver' },
      { label: 'Energy Credits (Solar, Heat Pumps)', name: 'energy' },
      { label: 'Electric Vehicle Credit', name: 'ev' },
      { label: 'Premium Tax Credit (Marketplace Insurance)', name: 'premium' },
    ]} />
  </SectionWrapper>
);

const EducationSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Education">
    <FormGroup label="Did you pay college tuition? (Form 1098-T)">
      <RadioGroup name="edu_tuition" value={str(data.edu_tuition)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
    <FormGroup label="Did you pay student loan interest?">
      <RadioGroup name="edu_loan_interest" value={str(data.edu_loan_interest)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const RetirementSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Retirement Contributions" description="Track contributions for 2025 limits.">
    <FieldGrid>
      <FormGroup label="401(k) / 403(b) Contributions"><Input type="number" name="ret_401k" value={str(data.ret_401k)} onChange={onChange} placeholder="$" /></FormGroup>
      <FormGroup label="IRA (Traditional/Roth)"><Input type="number" name="ret_ira" value={str(data.ret_ira)} onChange={onChange} placeholder="$" /></FormGroup>
      <FormGroup label="HSA Contributions"><Input type="number" name="ret_hsa" value={str(data.ret_hsa)} onChange={onChange} placeholder="$" /></FormGroup>
    </FieldGrid>
  </SectionWrapper>
);

const HealthSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Health Insurance">
    <FormGroup label="Were you covered by health insurance all year?">
      <RadioGroup name="health_covered" value={str(data.health_covered)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
    <FormGroup label="Did you have Marketplace Insurance (Form 1095-A)?">
      <RadioGroup name="health_marketplace" value={str(data.health_marketplace)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const ForeignSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Foreign & Digital Assets" description="High-penalty reporting areas.">
    <FormGroup label="Do you have foreign bank accounts (FBAR)?">
      <RadioGroup name="for_fbar" value={str(data.for_fbar)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
    <FormGroup label="Did you have cryptocurrency transactions (Buy/Sell/Exchange)?">
      <RadioGroup name="for_crypto" value={str(data.for_crypto)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const EstimatedTaxSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Estimated Tax Payments">
    <FieldGrid>
      <FormGroup label="Federal Estimated Taxes Paid"><Input type="number" name="est_fed" value={str(data.est_fed)} onChange={onChange} placeholder="$" /></FormGroup>
      <FormGroup label="State Estimated Taxes Paid"><Input type="number" name="est_state" value={str(data.est_state)} onChange={onChange} placeholder="$" /></FormGroup>
    </FieldGrid>
  </SectionWrapper>
);

const LifeEventsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Life Events" description="Identify special tax rules.">
    <CheckboxGroup prefix="life" data={data} onChange={onChange} options={[
      { label: 'Marriage or Divorce', name: 'marriage_divorce' },
      { label: 'Birth or Adoption', name: 'birth_adoption' },
      { label: 'Job Change', name: 'job_change' },
      { label: 'Business Started or Closed', name: 'business_change' },
      { label: 'Home Purchase or Sale', name: 'home_change' },
      { label: 'Disaster or Major Medical Event', name: 'disaster' },
    ]} />
  </SectionWrapper>
);

const BankingSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Banking & Filing" description="For direct deposit and authorization.">
    <FieldGrid>
      <FormGroup label="Bank Name"><Input name="bank_name" value={str(data.bank_name)} onChange={onChange} /></FormGroup>
      <FormGroup label="Routing Number"><Input name="bank_routing" value={str(data.bank_routing)} onChange={onChange} /></FormGroup>
      <FormGroup label="Account Number"><Input name="bank_account" value={str(data.bank_account)} onChange={onChange} /></FormGroup>
    </FieldGrid>
  </SectionWrapper>
);
