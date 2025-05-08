import { analyzeEmailContent, OtherMessageResponse, SalesInquiryResponse } from './deepseekAPI';
import { db } from '../../db';
import { salesInquiries, otherMessages } from '../../db/schema';
import { is } from 'drizzle-orm';

export async function classifyEmailContent(emailObject: any) {
    try {
        let analysisResult = await analyzeEmailContent(emailObject);

        if (analysisResult.isInquiry) {
            analysisResult = {
                messageId: analysisResult.messageId,
                senderEmail: analysisResult.senderEmail,
                senderName: analysisResult.senderName,
                companyName: (analysisResult as SalesInquiryResponse).companyName,
                mobileNumber: (analysisResult as SalesInquiryResponse).mobileNumber,
                emailSubject: analysisResult.emailSubject,
                emailSummary: analysisResult.emailSummary,
                extractedJson: analysisResult.extractedJson,
                emailRaw: analysisResult.emailRaw,
                emailDate: new Date(analysisResult.emailDate),
                inquiryType: analysisResult.inquiryType,
                isInquiry: analysisResult.isInquiry,
            } as SalesInquiryResponse;
            await db.insert(salesInquiries).values(analysisResult as any);
        } else {
            analysisResult = {
                messageId: analysisResult.messageId,
                senderEmail: analysisResult.senderEmail,
                senderName: analysisResult.senderName,
                emailSubject: analysisResult.emailSubject,
                emailSummary: analysisResult.emailSummary,
                extractedJson: analysisResult.extractedJson,
                emailRaw: analysisResult.emailRaw,
                emailDate: new Date(analysisResult.emailDate),
                inquiryType: analysisResult.inquiryType,
                isInquiry: analysisResult.isInquiry,
            } as OtherMessageResponse;
            await db.insert(otherMessages).values(analysisResult as any);
        }
        return analysisResult;
    } catch (error) {
        console.error('Error classifying email:', error);
        return null;
    }
}
