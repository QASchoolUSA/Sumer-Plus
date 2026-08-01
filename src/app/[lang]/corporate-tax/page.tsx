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
  FieldGrid,
  DashedButton,
  MutedNote,
  GroupHeading,
  taxFormStyles,
  type FormDataMap,
  type FormChangeHandler,
} from '@/components/TaxQuestionnaire/TaxFormControls';

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
        body: JSON.stringify({ type: 'Corporate', data: formData }),
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
        message="Your Corporate Tax Questionnaire has been successfully submitted. We have received your information and will review it shortly."
      />
    );
  }

  return (
    <TaxWizardShell
      title="Corporate Tax Questionnaire"
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

type SectionProps = { data: FormDataMap; onChange: FormChangeHandler };
const str = (v: string | boolean | undefined) => (typeof v === 'string' ? v : '');

const CompanyInfoSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Company Information">
    <FieldGrid>
      <FormGroup label="Legal Name of Entity"><Input name="legal_name" value={str(data.legal_name)} onChange={onChange} /></FormGroup>
      <FormGroup label="DBA / Trade Name"><Input name="dba" value={str(data.dba)} onChange={onChange} /></FormGroup>
    </FieldGrid>
    <FormGroup label="Entity Type">
      <RadioGroup name="entity_type" value={str(data.entity_type)} onChange={onChange} options={[
        { label: 'C-Corporation', value: 'c_corp' },
        { label: 'S-Corporation', value: 's_corp' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'LLC', value: 'llc' },
      ]} />
    </FormGroup>
    <FieldGrid>
      <FormGroup label="EIN"><Input name="ein" value={str(data.ein)} onChange={onChange} /></FormGroup>
      <FormGroup label="State of Incorporation"><Input name="inc_state" value={str(data.inc_state)} onChange={onChange} /></FormGroup>
      <FormGroup label="Date of Formation"><Input type="date" name="inc_date" value={str(data.inc_date)} onChange={onChange} /></FormGroup>
      <FormGroup label="Fiscal Year End"><Input name="fiscal_year" value={str(data.fiscal_year)} onChange={onChange} placeholder="e.g. Dec 31" /></FormGroup>
    </FieldGrid>
    <FormGroup label="Business Address"><Input name="address" value={str(data.address)} onChange={onChange} /></FormGroup>
    <FormGroup label="Accounting Method">
      <RadioGroup name="accounting_method" value={str(data.accounting_method)} onChange={onChange} options={[
        { label: 'Cash', value: 'cash' },
        { label: 'Accrual', value: 'accrual' },
      ]} />
    </FormGroup>
  </SectionWrapper>
);

const OwnershipSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Ownership & Equity">
    <div className={taxFormStyles.panel}>
      <p className={taxFormStyles.panelTitle}>Owner/Shareholder 1</p>
      <FieldGrid>
        <FormGroup label="Name"><Input name="owner1_name" value={str(data.owner1_name)} onChange={onChange} /></FormGroup>
        <FormGroup label="Ownership %"><Input name="owner1_pct" value={str(data.owner1_pct)} onChange={onChange} /></FormGroup>
      </FieldGrid>
      <FormGroup label="Tax Residency"><Input name="owner1_residency" value={str(data.owner1_residency)} onChange={onChange} /></FormGroup>
    </div>
    <DashedButton onClick={() => alert('Add owner logic')}>+ Add Another Owner</DashedButton>
    <FormGroup label="Any ownership changes during the year?">
      <RadioGroup name="ownership_changes" value={str(data.ownership_changes)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const ServicesSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Nature of Services">
    <FormGroup label="Description of Business"><Input name="business_desc" value={str(data.business_desc)} onChange={onChange} /></FormGroup>
    <FormGroup label="NAICS Code"><Input name="naics" value={str(data.naics)} onChange={onChange} /></FormGroup>
  </SectionWrapper>
);

const RevenueSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Revenue">
    <FormGroup label="Total Gross Receipts"><Input name="gross_receipts" value={str(data.gross_receipts)} onChange={onChange} /></FormGroup>
    <GroupHeading>Revenue Source Breakdown</GroupHeading>
    <CheckboxGroup prefix="rev_source" data={data} onChange={onChange} options={[
      { label: 'Individuals', name: 'individuals' },
      { label: 'Businesses', name: 'businesses' },
      { label: 'Government Entities', name: 'government' },
    ]} />
    <FormGroup label="Any client > 20% of total revenue?">
      <RadioGroup name="revenue_concentration" value={str(data.revenue_concentration)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const SALTSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="State & Local Tax (SALT)">
    <FormGroup label="States where employees/offices located"><Input name="salt_emp_states" value={str(data.salt_emp_states)} onChange={onChange} /></FormGroup>
    <FormGroup label="States where services are performed"><Input name="salt_svc_states" value={str(data.salt_svc_states)} onChange={onChange} /></FormGroup>
  </SectionWrapper>
);

const SalesTaxSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Sales Tax">
    <FormGroup label="Is company registered for sales tax in any state?">
      <RadioGroup name="sales_tax_reg" value={str(data.sales_tax_reg)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const PayrollSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Payroll">
    <FormGroup label="Number of Employees"><Input name="num_employees" value={str(data.num_employees)} onChange={onChange} /></FormGroup>
    <FormGroup label="Total Gross Payroll"><Input name="gross_payroll" value={str(data.gross_payroll)} onChange={onChange} /></FormGroup>
  </SectionWrapper>
);

const ContractorsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Independent Contractors (1099)">
    <FormGroup label="Did you use independent contractors?">
      <RadioGroup name="use_contractors" value={str(data.use_contractors)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
    <FormGroup label="Were Form 1099-NEC filed on time?">
      <RadioGroup name="filed_1099" value={str(data.filed_1099)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const ExpensesSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Expenses">
    <MutedNote>Ideally, upload your P&L or Trial Balance. Enter key totals below if manual.</MutedNote>
    <FieldGrid>
      <FormGroup label="Rent"><Input name="exp_rent" value={str(data.exp_rent)} onChange={onChange} /></FormGroup>
      <FormGroup label="Software & SaaS"><Input name="exp_software" value={str(data.exp_software)} onChange={onChange} /></FormGroup>
      <FormGroup label="Professional Fees"><Input name="exp_prof_fees" value={str(data.exp_prof_fees)} onChange={onChange} /></FormGroup>
      <FormGroup label="Marketing"><Input name="exp_marketing" value={str(data.exp_marketing)} onChange={onChange} /></FormGroup>
    </FieldGrid>
  </SectionWrapper>
);

const AssetsSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Assets & Depreciation">
    <FormGroup label="Fixed assets purchased (Computers, Furniture etc)"><Input name="assets_purchased" value={str(data.assets_purchased)} onChange={onChange} /></FormGroup>
  </SectionWrapper>
);

const FinancingSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Financing">
    <FormGroup label="Business Loans / Lines of Credit"><Input name="loans" value={str(data.loans)} onChange={onChange} /></FormGroup>
    <FormGroup label="Capital Contributions"><Input name="capital_contributions" value={str(data.capital_contributions)} onChange={onChange} /></FormGroup>
  </SectionWrapper>
);

const FederalTaxSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Federal Tax">
    <FormGroup label="Estimated Tax Payments Made"><Input name="fed_est_tax" value={str(data.fed_est_tax)} onChange={onChange} /></FormGroup>
  </SectionWrapper>
);

const InternationalSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="International">
    <FormGroup label="Foreign Clients or Revenue?">
      <RadioGroup name="intl_revenue" value={str(data.intl_revenue)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
    <FormGroup label="Foreign Contractors?">
      <RadioGroup name="intl_contractors" value={str(data.intl_contractors)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);

const ComplianceSection = ({ data, onChange }: SectionProps) => (
  <SectionWrapper title="Compliance & Risk">
    <FormGroup label="IRS/State Audits or Notices Received?">
      <RadioGroup name="audits" value={str(data.audits)} onChange={onChange} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
    </FormGroup>
  </SectionWrapper>
);
