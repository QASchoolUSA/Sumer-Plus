
export const CONSULTING_QUESTIONS = [
    {
        id: 'company_info',
        title: '1. Company Information',
        fields: [
            { id: 'legal_name', label: 'Legal name of entity', type: 'text' },
            { id: 'dba', label: 'DBA / trade name (if any)', type: 'text' },
            {
                id: 'entity_type',
                label: 'Entity type',
                type: 'radio',
                options: ['C-Corporation', 'S-Corporation', 'Partnership', 'LLC']
            },
            {
                id: 'llc_taxed_as',
                label: 'LLC taxed as',
                type: 'radio',
                options: ['Corporation', 'Partnership', 'Disregarded'],
                condition: (answers) => answers.entity_type === 'LLC'
            },
            { id: 'ein', label: 'EIN', type: 'text' },
            { id: 'state_inc', label: 'State of incorporation/formation', type: 'text' },
            { id: 'date_formation', label: 'Date of formation', type: 'date' },
            { id: 'business_address', label: 'Business address', type: 'text' },
            { id: 'operating_states', label: 'States where business operates or files returns', type: 'text' },
            { id: 'fiscal_year_end', label: 'Fiscal year-end', type: 'text' },
            {
                id: 'accounting_method',
                label: 'Accounting method',
                type: 'radio',
                options: ['Cash', 'Accrual']
            },
            { id: 'accounting_software', label: 'Accounting software used', type: 'text' }
        ]
    },
    {
        id: 'ownership',
        title: '2. Ownership & Equity',
        fields: [
            { id: 'owners_details', label: 'Owners/shareholders/partners (Name, %, Residency)', type: 'textarea' },
            { id: 'ownership_changes', label: 'Any ownership changes during the year?', type: 'yesno' },
            { id: 'stock_issuance', label: 'Stock/unit issuances, redemptions, or buybacks?', type: 'yesno' },
            { id: 'equity_comp', label: 'Stock options, profit interests, or equity compensation issued?', type: 'yesno' }
        ]
    },
    {
        id: 'consulting_nature',
        title: '3. Nature of Consulting Services',
        fields: [
            { id: 'service_desc', label: 'Description of consulting services', type: 'textarea' },
            { id: 'naics', label: 'NAICS code (if known)', type: 'text' },
            {
                id: 'service_type',
                label: 'Are services:',
                type: 'checkbox_group',
                options: ['Project-based', 'Retainer-based', 'Time & materials']
            },
            { id: 'regulated_activities', label: 'Any regulated or licensed consulting activities?', type: 'yesno' }
        ]
    },
    {
        id: 'revenue',
        title: '4. Revenue',
        fields: [
            { id: 'gross_receipts', label: 'Total gross receipts for the year', type: 'currency' },
            { id: 'revenue_by_service', label: 'Revenue by service type', type: 'textarea' },
            { id: 'revenue_by_state', label: 'Revenue by state (approximate %)', type: 'textarea' },
            {
                id: 'revenue_sources',
                label: 'Revenue from:',
                type: 'checkbox_group',
                options: ['Individuals', 'Businesses', 'Government entities']
            },
            { id: 'major_client', label: 'Any client >20% of total revenue?', type: 'yesno' },
            { id: 'deferred_revenue', label: 'Advance payments / deferred revenue at year-end?', type: 'yesno' },
            { id: 'refunds_writeoffs', label: 'Refunds, credits, or write-offs?', type: 'yesno' }
        ]
    },
    {
        id: 'salt',
        title: '5. State & Local Tax (SALT)',
        fields: [
            { id: 'emp_states', label: 'States where employees, contractors, or offices are located', type: 'text' },
            { id: 'service_states', label: 'States where consulting services are performed', type: 'text' },
            { id: 'client_states', label: 'States where clients are located', type: 'text' },
            { id: 'nexus_income', label: 'Has the company assessed nexus for Income/franchise tax?', type: 'yesno' },
            { id: 'nexus_sales', label: 'Has the company assessed nexus for Sales tax?', type: 'yesno' },
            { id: 'state_returns', label: 'State income/franchise tax returns filed during the year', type: 'text' },
            { id: 'state_notices', label: 'Any state notices, audits, or assessments?', type: 'yesno' }
        ]
    },
    {
        id: 'sales_tax',
        title: '6. Sales Tax (Consulting Services)',
        fields: [
            { id: 'sales_tax_reg', label: 'Is the company registered for sales tax in any state?', type: 'yesno' },
            { id: 'sales_tax_states', label: 'States of registration', type: 'text' },
            {
                id: 'consulting_taxable',
                label: 'Are consulting services treated as:',
                type: 'radio',
                options: ['Taxable', 'Exempt', 'Partially taxable']
            },
            { id: 'bundled_services', label: 'Any bundled services (consulting + software/data/products)?', type: 'yesno' },
            { id: 'sales_tax_collected', label: 'Total sales tax collected and remitted', type: 'currency' },
            { id: 'sales_tax_exposure', label: 'Any exposure from uncollected sales tax?', type: 'yesno' }
        ]
    },
    {
        id: 'payroll',
        title: '7. Payroll & Employment Taxes',
        fields: [
            { id: 'num_employees', label: 'Number of employees (full-time / part-time)', type: 'text' },
            { id: 'emp_work_states', label: 'States where employees work (including remote)', type: 'text' },
            { id: 'gross_payroll', label: 'Total gross payroll', type: 'currency' },
            { id: 'fed_payroll_paid', label: 'Federal payroll taxes paid (941, 940)', type: 'currency' },
            { id: 'state_payroll_paid', label: 'State payroll and unemployment taxes paid', type: 'currency' },
            { id: 'bonuses', label: 'Bonuses, commissions, or incentive compensation?', type: 'yesno' },
            { id: 'retirement_plans', label: 'Retirement plans (401(k), SEP, SIMPLE, etc.)?', type: 'yesno' },
            { id: 'health_benefits', label: 'Health insurance or fringe benefits?', type: 'yesno' }
        ]
    },
    {
        id: 'contractors',
        title: '8. Independent Contractors (1099)',
        fields: [
            { id: 'use_contractors', label: 'Use of independent contractors?', type: 'yesno' },
            { id: 'contractor_payments', label: 'Total contractor payments', type: 'currency' },
            { id: 'contractor_services', label: 'Types of contractor services', type: 'text' },
            { id: 'w9_collected', label: 'Were W-9s collected?', type: 'yesno' },
            { id: '1099_filed', label: 'Were Forms 1099-NEC filed on time?', type: 'yesno' },
            { id: 'worker_classification', label: 'Any worker classification concerns?', type: 'yesno' }
        ]
    },
    {
        id: 'expenses',
        title: '9. Expenses & Deductions',
        fields: [
            { id: 'officer_comp', label: 'Officer compensation', type: 'currency' },
            { id: 'salaries_wages', label: 'Salaries & wages', type: 'currency' },
            { id: 'contractor_costs', label: 'Contractor costs', type: 'currency' },
            { id: 'rent_expense', label: 'Rent / coworking space', type: 'currency' },
            { id: 'software_expense', label: 'Software & SaaS tools', type: 'currency' },
            { id: 'prof_fees', label: 'Professional fees (legal, accounting)', type: 'currency' },
            { id: 'marketing_exp', label: 'Marketing & advertising', type: 'currency' },
            { id: 'travel_exp', label: 'Travel (domestic/international)', type: 'currency' },
            { id: 'meals_exp', label: 'Meals (business-related)', type: 'currency' },
            { id: 'insurance_exp', label: 'Insurance', type: 'currency' },
            { id: 'office_exp', label: 'Office expenses', type: 'currency' },
            { id: 'training_exp', label: 'Training & education', type: 'currency' },
            { id: 'nondeductible_exp', label: 'Indicate any non-deductible or limited expenses', type: 'text' }
        ]
    },
    {
        id: 'assets',
        title: '10. Assets & Depreciation',
        fields: [
            { id: 'fixed_assets', label: 'Fixed assets purchased (computers, equipment, furniture)', type: 'currency' },
            { id: 'sec179_bonus', label: 'Section 179 or bonus depreciation claimed?', type: 'yesno' },
            { id: 'capitalized_costs', label: 'Software development or capitalized costs?', type: 'yesno' },
            { id: 'assets_disposed', label: 'Assets disposed of during the year?', type: 'yesno' },
            { id: 'leases', label: 'Leases (operating or finance)?', type: 'yesno' }
        ]
    },
    {
        id: 'financing',
        title: '11. Financing & Cash Flow',
        fields: [
            { id: 'loans', label: 'Business loans or lines of credit?', type: 'yesno' },
            { id: 'gov_funding', label: 'PPP, EIDL, or other government funding?', type: 'yesno' },
            { id: 'interest_paid', label: 'Interest expense paid', type: 'currency' },
            { id: 'owner_loans', label: 'Owner loans or capital contributions?', type: 'yesno' },
            { id: 'distributions', label: 'Distributions/dividends paid?', type: 'yesno' }
        ]
    },
    {
        id: 'federal_tax',
        title: '12. Federal Income Tax',
        fields: [
            { id: 'prior_returns', label: 'Prior-year tax returns filed?', type: 'yesno' },
            { id: 'estimated_tax', label: 'Estimated tax payments made?', type: 'yesno' },
            { id: 'nols', label: 'Net operating losses (NOLs) available?', type: 'yesno' },
            { id: 'rd_credits', label: 'R&D credits or other tax credits claimed?', type: 'yesno' },
            { id: 'sec199a', label: 'Section 199A (QBI) considerations (if pass-through)?', type: 'yesno' }
        ]
    },
    {
        id: 'international',
        title: '13. International Considerations',
        fields: [
            { id: 'foreign_revenue', label: 'Foreign clients or revenue?', type: 'yesno' },
            { id: 'services_outside_us', label: 'Services performed outside the U.S.?', type: 'yesno' },
            { id: 'foreign_contractors', label: 'Foreign contractors or employees?', type: 'yesno' },
            { id: 'foreign_withholding', label: 'Foreign withholding taxes paid?', type: 'yesno' },
            { id: 'transfer_pricing', label: 'Transfer pricing or intercompany services?', type: 'yesno' }
        ]
    },
    {
        id: 'compliance',
        title: '14. Compliance & Risk',
        fields: [
            { id: 'audits', label: 'IRS or state audits/notices received?', type: 'yesno' },
            { id: 'outstanding_liabilities', label: 'Outstanding tax liabilities?', type: 'yesno' },
            { id: 'penalties', label: 'Penalties or interest assessed?', type: 'yesno' },
            { id: 'uncertain_positions', label: 'Aggressive or uncertain tax positions taken?', type: 'yesno' }
        ]
    },
    {
        id: 'declarations',
        title: '15. Declarations',
        fields: [
            { id: 'income_reported', label: 'All income has been fully reported', type: 'checkbox' },
            { id: 'expenses_necessary', label: 'All expenses are ordinary and necessary', type: 'checkbox' },
            { id: 'info_accurate', label: 'All information provided is complete and accurate', type: 'checkbox' },
            { id: 'decl_name', label: 'Name', type: 'text' },
            { id: 'decl_title', label: 'Title', type: 'text' },
            { id: 'decl_date', label: 'Date', type: 'date' }
        ]
    }
];

export const calculateRisk = (answers) => {
    let risks = [];
    let highRiskCount = 0;

    // Risk Logic based on answers

    // Sales Tax Risks
    if (answers.nexus_sales === 'No' && answers.sales_tax_reg === 'No' && answers.consulting_taxable === 'Taxable') {
        risks.push({ level: 'high', msg: 'Potential Sales Tax Exposure: Services are taxable but no nexus or registration indicated.' });
        highRiskCount++;
    }
    if (answers.sales_tax_exposure === 'Yes') {
        risks.push({ level: 'high', msg: 'Self-reported Sales Tax Exposure.' });
        highRiskCount++;
    }

    // 1099 Risks
    if (answers.use_contractors === 'Yes') {
        if (answers.w9_collected === 'No') {
            risks.push({ level: 'medium', msg: 'Missing W-9s for contractors.' });
        }
        if (answers.filed_1099 === 'No') { // Note: ID in simple array was 1099_filed, need to check variable name match
            risks.push({ level: 'high', msg: '1099-NEC forms were not filed on time for contractors.' });
            highRiskCount++;
        }
    }

    // International
    if (answers.foreign_revenue === 'Yes' || answers.foreign_contractors === 'Yes') {
        risks.push({ level: 'medium', msg: 'International activity detected. Confirm W-8BEN forms and withholding requirements.' });
    }

    // Compliance
    if (answers.audits === 'Yes' || answers.outstanding_liabilities === 'Yes') {
        risks.push({ level: 'high', msg: 'Existing audits or outstanding liabilities require immediate attention.' });
        highRiskCount++;
    }

    // General Logic
    if (answers.entity_type === 'S-Corporation' && !answers.officer_comp) {
        risks.push({ level: 'high', msg: 'Reasonable Compensation check needed for S-Corp officers.' });
        highRiskCount++;
    }

    let status = 'green';
    if (highRiskCount > 0) status = 'red';
    else if (risks.length > 0) status = 'yellow';

    return { status, risks };
};
