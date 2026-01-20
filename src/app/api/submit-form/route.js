import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

// --- Questionnaire Schemas ---

const CORPORATE_SCHEMA = [
    {
        title: 'Company Information',
        fields: [
            { key: 'legal_name', label: 'Legal Name of Entity' },
            { key: 'dba', label: 'DBA / Trade Name' },
            { key: 'entity_type', label: 'Entity Type', type: 'select', options: { c_corp: 'C-Corporation', s_corp: 'S-Corporation', partnership: 'Partnership', llc: 'LLC' } },
            { key: 'ein', label: 'EIN' },
            { key: 'inc_state', label: 'State of Incorporation' },
            { key: 'inc_date', label: 'Date of Formation' },
            { key: 'fiscal_year', label: 'Fiscal Year End' },
            { key: 'address', label: 'Business Address' },
            { key: 'accounting_method', label: 'Accounting Method', type: 'select', options: { cash: 'Cash', accrual: 'Accrual' } },
        ]
    },
    {
        title: 'Ownership & Equity',
        fields: [
            { key: 'owner1_name', label: 'Owner 1 Name' },
            { key: 'owner1_pct', label: 'Owner 1 %' },
            { key: 'owner1_residency', label: 'Owner 1 Tax Residency' },
            { key: 'ownership_changes', label: 'Ownership Changes?', type: 'boolean' },
        ]
    },
    {
        title: 'Nature of Services',
        fields: [
            { key: 'business_desc', label: 'Description of Business' },
            { key: 'naics', label: 'NAICS Code' },
        ]
    },
    {
        title: 'Revenue',
        fields: [
            { key: 'gross_receipts', label: 'Total Gross Receipts' },
            { key: 'rev_source_individuals', label: 'Rev Source: Individuals', type: 'checkbox' },
            { key: 'rev_source_businesses', label: 'Rev Source: Businesses', type: 'checkbox' },
            { key: 'rev_source_government', label: 'Rev Source: Government', type: 'checkbox' },
            { key: 'revenue_concentration', label: 'Client > 20% Revenue?', type: 'boolean' },
        ]
    },
    {
        title: 'State & Local Tax (SALT)',
        fields: [
            { key: 'salt_emp_states', label: 'States with Employees/Offices' },
            { key: 'salt_svc_states', label: 'States where services performed' },
        ]
    },
    {
        title: 'Sales Tax',
        fields: [
            { key: 'sales_tax_reg', label: 'Registered for Sales Tax?', type: 'boolean' },
        ]
    },
    {
        title: 'Payroll',
        fields: [
            { key: 'num_employees', label: 'Number of Employees' },
            { key: 'gross_payroll', label: 'Total Gross Payroll' },
        ]
    },
    {
        title: 'Independent Contractors',
        fields: [
            { key: 'use_contractors', label: 'Used Independent Contractors?', type: 'boolean' },
            { key: 'filed_1099', label: '1099-NEC Filed?', type: 'boolean' },
        ]
    },
    {
        title: 'Expenses',
        fields: [
            { key: 'exp_rent', label: 'Rent' },
            { key: 'exp_software', label: 'Software & SaaS' },
            { key: 'exp_prof_fees', label: 'Professional Fees' },
            { key: 'exp_marketing', label: 'Marketing' },
        ]
    },
    {
        title: 'Assets',
        fields: [
            { key: 'assets_purchased', label: 'Fixed Assets Purchased' },
        ]
    },
    {
        title: 'Financing',
        fields: [
            { key: 'loans', label: 'Business Loans / Lines of Credit' },
            { key: 'capital_contributions', label: 'Capital Contributions' },
        ]
    },
    {
        title: 'Federal Tax',
        fields: [
            { key: 'fed_est_tax', label: 'Estimated Tax Payments Made' },
        ]
    },
    {
        title: 'International',
        fields: [
            { key: 'intl_revenue', label: 'Foreign Clients/Revenue?', type: 'boolean' },
            { key: 'intl_contractors', label: 'Foreign Contractors?', type: 'boolean' },
        ]
    },
    {
        title: 'Compliance',
        fields: [
            { key: 'audits', label: 'Audits or Notices?', type: 'boolean' },
        ]
    }
];

const PERSONAL_SCHEMA = [
    {
        title: 'Taxpayer Information',
        fields: [
            { key: 'fullName', label: 'Full Name' },
            { key: 'spouseName', label: 'Spouse Name' },
            { key: 'ssn', label: 'SSN / ITIN' },
            { key: 'dob', label: 'Date of Birth' },
            { key: 'address', label: 'Address' },
            { key: 'filingStatus', label: 'Filing Status', type: 'select', options: { single: 'Single', married_joint: 'Married Filing Jointly', married_separate: 'Married Filing Separately', head_household: 'Head of Household', surviving_spouse: 'Qualifying Surviving Spouse' } },
            { key: 'moved2025', label: 'Moved in 2025?', type: 'boolean' },
        ]
    },
    {
        title: 'Dependents',
        fields: [
            { key: 'dep1_name', label: 'Dependent 1 Name' },
            { key: 'dep1_ssn', label: 'Dependent 1 SSN' },
            { key: 'dep1_rel', label: 'Dependent 1 Relationship' },
            { key: 'dep1_dob', label: 'Dependent 1 DOB' },
            { key: 'dep1_months', label: 'Months Lived w/ You' },
            { key: 'dep1_student', label: 'Student?', type: 'checkbox' },
        ]
    },
    {
        title: 'Income',
        fields: [
            { key: 'income_w2', label: 'W-2 Wages', type: 'checkbox' },
            { key: 'income_1099nec', label: '1099-NEC / Consulting', type: 'checkbox' },
            { key: 'income_schedulec', label: 'Business Income (Sch C)', type: 'checkbox' },
            { key: 'income_tips', label: 'Tips/Bonuses', type: 'checkbox' },
            { key: 'income_interest', label: 'Interest (1099-INT)', type: 'checkbox' },
            { key: 'income_dividends', label: 'Dividends (1099-DIV)', type: 'checkbox' },
            { key: 'income_capital_gains', label: 'Capital Gains', type: 'checkbox' },
            { key: 'income_rental', label: 'Rental Income', type: 'checkbox' },
            { key: 'income_royalties', label: 'Royalties', type: 'checkbox' },
            { key: 'income_unemployment', label: 'Unemployment', type: 'checkbox' },
            { key: 'income_social_security', label: 'Social Security', type: 'checkbox' },
            { key: 'income_retirement_dist', label: 'Retirement Distributions', type: 'checkbox' },
        ]
    },
    {
        title: 'Adjustments',
        fields: [
            { key: 'adj_ira', label: 'Traditional IRA', type: 'checkbox' },
            { key: 'adj_hsa', label: 'HSA Contributions', type: 'checkbox' },
            { key: 'adj_student_loan', label: 'Student Loan Interest', type: 'checkbox' },
            { key: 'adj_se_health', label: 'SE Health Insurance', type: 'checkbox' },
            { key: 'adj_se_retirement', label: 'SE Retirement', type: 'checkbox' },
            { key: 'adj_alimony', label: 'Alimony Paid', type: 'checkbox' },
        ]
    },
    {
        title: 'Deductions',
        fields: [
            { key: 'deduct_medical', label: 'Medical Expenses', type: 'checkbox' },
            { key: 'deduct_salt', label: 'State & Local Taxes', type: 'checkbox' },
            { key: 'deduct_mortgage', label: 'Mortgage Interest', type: 'checkbox' },
            { key: 'deduct_charity', label: 'Charitable Contributions', type: 'checkbox' },
            { key: 'deduct_casualty', label: 'Casualty Losses', type: 'checkbox' },
        ]
    },
    {
        title: 'Tax Credits',
        fields: [
            { key: 'credit_child', label: 'Child Tax Credit', type: 'checkbox' },
            { key: 'credit_other_dep', label: 'Other Dependent Credit', type: 'checkbox' },
            { key: 'credit_care', label: 'Dependent Care Credit', type: 'checkbox' },
            { key: 'credit_education', label: 'Education Credits', type: 'checkbox' },
            { key: 'credit_saver', label: 'Retirement Saver’s Credit', type: 'checkbox' },
            { key: 'credit_energy', label: 'Energy Credits', type: 'checkbox' },
            { key: 'credit_ev', label: 'EV Credit', type: 'checkbox' },
            { key: 'credit_premium', label: 'Premium Tax Credit', type: 'checkbox' },
        ]
    },
    {
        title: 'Education',
        fields: [
            { key: 'edu_tuition', label: 'Paid Tuition?', type: 'boolean' },
            { key: 'edu_loan_interest', label: 'Paid Student Loan Interest?', type: 'boolean' },
        ]
    },
    {
        title: 'Retirement',
        fields: [
            { key: 'ret_401k', label: '401(k) Contributions' },
            { key: 'ret_ira', label: 'IRA Contributions' },
            { key: 'ret_hsa', label: 'HSA Contributions' },
        ]
    },
    {
        title: 'Health',
        fields: [
            { key: 'health_covered', label: 'Covered All Year?', type: 'boolean' },
            { key: 'health_marketplace', label: 'Marketplace Insurance?', type: 'boolean' },
        ]
    },
    {
        title: 'Foreign',
        fields: [
            { key: 'for_fbar', label: 'Foreign Accounts?', type: 'boolean' },
            { key: 'for_crypto', label: 'Crypto Transactions?', type: 'boolean' },
        ]
    },
    {
        title: 'Estimated Tax',
        fields: [
            { key: 'est_fed', label: 'Federal Est. Paid' },
            { key: 'est_state', label: 'State Est. Paid' },
        ]
    },
    {
        title: 'Life Events',
        fields: [
            { key: 'life_marriage_divorce', label: 'Marriage/Divorce', type: 'checkbox' },
            { key: 'life_birth_adoption', label: 'Birth/Adoption', type: 'checkbox' },
            { key: 'life_job_change', label: 'Job Change', type: 'checkbox' },
            { key: 'life_business_change', label: 'Business Change', type: 'checkbox' },
            { key: 'life_home_change', label: 'Home Change', type: 'checkbox' },
            { key: 'life_disaster', label: 'Disaster', type: 'checkbox' },
        ]
    },
    {
        title: 'Banking',
        fields: [
            { key: 'bank_name', label: 'Bank Name' },
            { key: 'bank_routing', label: 'Routing Number' },
            { key: 'bank_account', label: 'Account Number' },
        ]
    }
];

// Helper to get string value for Email (using Emojis)
function getEmailDisplayValue(value, field) {
    if (field.type === 'checkbox') {
        return value ? '✅' : '❌';
    }
    if (field.type === 'boolean') {
        if (value === 'yes') return '✅';
        if (value === 'no') return '❌';
        return '<span style="color: #cbd5e1;">⚪</span>'; // Unanswered
    }
    if (field.type === 'select' && field.options) {
        return field.options[value] || value || '';
    }
    return value || '';
}

// Helper to get raw value for PDF
function getPdfRawValue(value, field) {
    if (field.type === 'checkbox') {
        return value ? true : false;
    }
    if (field.type === 'boolean') {
        if (value === 'yes') return true;
        if (value === 'no') return false;
        return null; // Unanswered
    }
    if (field.type === 'select' && field.options) {
        return field.options[value] || value || '';
    }
    return value || '';
}

function drawCheck(doc, x, y, size = 10) {
    doc.save();
    doc.lineWidth(1.5).strokeColor('green');
    // Check mark path
    doc.moveTo(x, y + size * 0.5)
        .lineTo(x + size * 0.4, y + size * 0.9)
        .lineTo(x + size, y)
        .stroke();
    doc.restore();
}

function drawCross(doc, x, y, size = 10) {
    doc.save();
    doc.lineWidth(1.5).strokeColor('red');
    // X path
    doc.moveTo(x, y).lineTo(x + size, y + size).stroke();
    doc.moveTo(x + size, y).lineTo(x, y + size).stroke();
    doc.restore();
}

function drawCircle(doc, x, y, size = 10) {
    doc.save();
    doc.lineWidth(1).strokeColor('#ccc');
    doc.circle(x + size / 2, y + size / 2, size / 2).stroke();
    doc.restore();
}


function createPDFBuffer(type, data, schema) {
    return new Promise((resolve, reject) => {
        // Enable bufferPages for footer injection and manual page control
        const doc = new PDFDocument({ margin: 50, bufferPages: true, autoFirstPage: false });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        doc.addPage(); // Manually add first page

        // --- Header ---
        doc.rect(0, 0, 612, 100).fill('#0A2540');
        doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text(`${type} Tax Questionnaire`, 50, 40);
        doc.fontSize(12).font('Helvetica').text(`Submission Date: ${new Date().toLocaleDateString()}`, 50, 75);

        doc.moveDown(4);

        // --- Content ---
        const startX = 50;
        const colWidth = 250;
        const colGap = 30;
        const lineHeight = 20;

        let currentY = doc.y;

        schema.forEach((section) => {
            // Check page break for section title
            // Leave enough space for Title + Underline + at least one row (approx 60px)
            if (currentY > 650) {
                doc.addPage();
                currentY = 50;
            }

            // Section Title
            doc.fillColor('#0A2540').fontSize(14).font('Helvetica-Bold').text(section.title, startX, currentY);
            currentY += 20; // Space for text
            doc.strokeColor('#D4AF37').lineWidth(1).moveTo(startX, currentY).lineTo(562, currentY).stroke();
            currentY += 15; // Space after underline

            // Fields (Iterate by Rows of 2)
            for (let i = 0; i < section.fields.length; i += 2) {
                const field1 = section.fields[i];
                const field2 = section.fields[i + 1]; // Might be undefined

                // Check page break for the ROW
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }

                // --- Column 1 ---
                const x1 = startX;
                doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold').text(field1.label, x1, currentY, { width: colWidth * 0.6, continued: false });

                const valueX1 = x1 + (colWidth * 0.65);
                const rawValue1 = getPdfRawValue(data[field1.key], field1);

                if (typeof rawValue1 === 'boolean') {
                    if (rawValue1 === true) drawCheck(doc, valueX1, currentY, 8);
                    else if (rawValue1 === false) drawCross(doc, valueX1, currentY, 8);
                    else drawCircle(doc, valueX1, currentY, 8);
                } else if (rawValue1 === null) {
                    drawCircle(doc, valueX1, currentY, 8);
                } else {
                    const textValue = rawValue1 || '';
                    const displayValue = textValue.toString().trim() === '' ? '(Empty)' : textValue;
                    doc.font('Helvetica').fillColor('#1e293b').text(displayValue, valueX1, currentY, { width: colWidth * 0.35 });
                }

                // --- Column 2 (if exists) ---
                if (field2) {
                    const x2 = startX + colWidth + colGap;
                    doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold').text(field2.label, x2, currentY, { width: colWidth * 0.6, continued: false });

                    const valueX2 = x2 + (colWidth * 0.65);
                    const rawValue2 = getPdfRawValue(data[field2.key], field2);

                    if (typeof rawValue2 === 'boolean') {
                        if (rawValue2 === true) drawCheck(doc, valueX2, currentY, 8);
                        else if (rawValue2 === false) drawCross(doc, valueX2, currentY, 8);
                        else drawCircle(doc, valueX2, currentY, 8);
                    } else if (rawValue2 === null) {
                        drawCircle(doc, valueX2, currentY, 8);
                    } else {
                        const textValue = rawValue2 || '';
                        const displayValue = textValue.toString().trim() === '' ? '(Empty)' : textValue;
                        doc.font('Helvetica').fillColor('#1e293b').text(displayValue, valueX2, currentY, { width: colWidth * 0.35 });
                    }
                }

                // Advance Row
                currentY += lineHeight;
            }

            currentY += 15; // Gap between sections
        });

        // Footer (Iterate over buffered pages to add footer to ALL pages)
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).fillColor('#94a3b8').text('Generated by Sumer Plus', 50, 730, { align: 'center', width: 500 });
        }

        doc.end();
    });
}



export async function POST(req) {
    try {
        const body = await req.json();
        const { type, data } = body;

        const schema = type === 'Corporate' ? CORPORATE_SCHEMA : PERSONAL_SCHEMA;

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // --- HTML Generation ---
        const sectionsHtml = schema.map(section => {
            const rows = section.fields.map(field => {
                const displayValue = getEmailDisplayValue(data[field.key], field);
                const showEmpty = displayValue === '' ? '<span style="color: #cbd5e1; font-style: italic;">(Empty)</span>' : displayValue;

                return `
                    <tr>
                        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600; width: 50%; vertical-align: middle;">
                            ${field.label}
                        </td>
                        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; width: 50%; vertical-align: middle;">
                            ${showEmpty}
                        </td>
                    </tr>
                `;
            }).join('');

            return `
                <div style="margin-bottom: 24px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
                    <div style="background-color: #f8fafc; padding: 10px 16px; border-bottom: 1px solid #e2e8f0;">
                        <h3 style="margin: 0; color: #0A2540; font-size: 15px; font-weight: 700;">${section.title}</h3>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        ${rows}
                    </table>
                </div>
            `;
        }).join('');

        const pdfBuffer = await createPDFBuffer(type, data, schema);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sumerplusacc@gmail.com',
            subject: `New ${type} Questionnaire Submission - Sumer Plus`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${type} Tax Questionnaire</title>
                </head>
                <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f1f5f9;">
                    <div style="max-width: 680px; margin: 0 auto;">
                        
                        <!-- Header -->
                        <div style="background-color: #0A2540; padding: 32px 20px; text-align: center; border-radius: 0 0 8px 8px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">${type} Tax Questionnaire</h1>
                            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Submission Date: ${new Date().toLocaleDateString()}</p>
                        </div>

                        <!-- Content -->
                        <div style="padding: 32px 16px;">
                            ${sectionsHtml}
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #ffffff; border-top: 1px solid #e2e8f0; padding: 24px 20px; text-align: center; color: #94a3b8; font-size: 11px; border-radius: 8px 8px 0 0;">
                            <p style="margin: 0;">© ${new Date().getFullYear()} Sumer Plus. Automated email.</p>
                        </div>

                    </div>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: `${type}_Tax_Questionnaire.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
