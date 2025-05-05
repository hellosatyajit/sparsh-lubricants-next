// import { db } from '../../db';  // Ensure the path to the database connection is correct
// import { emails } from '../../db/schema';  // Ensure the path to the schema is correct

// export async function classifyEmail(subject: string, fromEmail: string, body: string, isInquiry: boolean) {
//   const status = isInquiry ? 'Inquiry' : 'Non-Inquiry';

//   try {
//     const result = await db.insert(emails).values({
//       subject,
//       fromEmail,
//       body,
//       status,
//     });

//     return result;
//   } catch (error) {
//     console.error('Error inserting email:', error);
//     throw new Error('Failed to classify email');
//   }
// }


import { analyzeEmailContent } from './deepseekAPI';  // Adjust import path
import { db } from '../../db';
import { salesInquiries, otherMessages } from '../../db/schema';

export async function classifyEmailContent(emailContent: string, emailSubject: string) {
    try {
        const analysisResult = await analyzeEmailContent(emailContent, emailSubject);
        
        // Assuming `analysisResult` contains the analysis response from Deepseek
        const { is_inquiry, inquiry_type, inquiry_reason, sender_name, company_name, mobile_number, purpose, key_questions, summary } = analysisResult;

        // Example to handle saving the result to DB
        if (is_inquiry) {
            // Save as sales inquiry or any other specific inquiry type
            await db.insert(salesInquiries).values({
                message_id: 'some-id', // Replace with actual data
                sender_email: 'sender@example.com', // Replace with actual data
                sender_name,
                mobile_number,
                company_name,
                email_subject: emailSubject,
                email_summary: summary,
                inquiry_type,
                inquiry_reason,
                extracted_json: JSON.stringify(analysisResult),
            });
        } else {
            await db.insert(otherMessages).values({
                message_id: 'some-id', // Replace with actual data
                sender_email: 'sender@example.com', // Replace with actual data
                sender_name,
                email_subject: emailSubject,
                email_summary: summary,
                inquiry_type,
                extracted_json: JSON.stringify(analysisResult),
            });
        }
    } catch (error) {
        console.error('Error classifying email:', error);
        throw new Error('Failed to classify email');
    }
}
