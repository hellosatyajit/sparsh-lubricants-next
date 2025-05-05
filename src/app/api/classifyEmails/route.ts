// import { NextResponse } from 'next/server';
// import { classifyEmail } from '../../../services/emailservices/classifyemail';  // Make sure the path is correct

// export async function POST(req: Request) {
//   try {
//     const { subject, fromEmail, body, isInquiry } = await req.json();

//     // Handle the email classification
//     const classification = await classifyEmail(subject, fromEmail, body, isInquiry);

//     return NextResponse.json({ message: 'Email classified successfully', classification });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Error classifying email' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import { classifyEmailContent } from '../../../services/emailservices/classifyemail';  // Adjust import path

export async function POST(req: Request) {
    try {
        const { emailContent, emailSubject } = await req.json();

        if (!emailContent || !emailSubject) {
            return NextResponse.json(
                { error: 'Email content and subject are required' },
                { status: 400 }
            );
        }

        await classifyEmailContent(emailContent, emailSubject);
        
        return NextResponse.json({ message: 'Email classified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error classifying email:', error);
        return NextResponse.json({ error: 'Failed to classify email' }, { status: 500 });
    }
}
