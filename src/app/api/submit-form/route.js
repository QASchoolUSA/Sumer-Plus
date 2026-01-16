import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, data } = body;

        // Create a transporter using Gmail
        // secure: true for 465, false for other ports
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // 'sumerplusacc@gmail.com'
                pass: process.env.EMAIL_PASS, // App Password
            },
        });

        // Format data into a readable string/HTML
        const formattedRows = Object.entries(data)
            .map(([key, value]) => {
                // Humanize key (e.g., "fullName" -> "Full Name")
                const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace(/_/g, ' ');

                // Format boolean values
                let displayValue = value;
                if (value === true) displayValue = 'Yes';
                if (value === false) displayValue = 'No';

                return `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600; width: 40%;">${label}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${displayValue}</td>
                    </tr>
                `;
            })
            .join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sumerplusacc@gmail.com',
            subject: `New ${type} Questionnaire Submission - Sumer Plus`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f1f5f9; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                        .header { background-color: #0f172a; color: #ffffff; padding: 32px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
                        .content { padding: 32px; }
                        .summary-table { width: 100%; border-collapse: collapse; font-size: 14px; }
                        .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>${type} Tax Questionnaire</h1>
                        </div>
                        <div class="content">
                            <p style="margin-bottom: 24px;">A new questionnaire has been successfully submitted via the Sumer Plus website.</p>
                            <table class="summary-table">
                                ${formattedRows}
                            </table>
                        </div>
                        <div class="footer">
                            <p>This email was sent automatically from your website.</p>
                            <p>© ${new Date().getFullYear()} Sumer Plus. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
