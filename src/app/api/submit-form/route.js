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
        const formattedData = Object.entries(data)
            .map(([key, value]) => `<b>${key}:</b> ${value}`)
            .join('<br>');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sumerplusacc@gmail.com',
            subject: `New ${type} Questionnaire Submission`,
            html: `
                <h1>New ${type} Questionnaire Submission</h1>
                <p>A new form has been submitted.</p>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                    ${formattedData}
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
