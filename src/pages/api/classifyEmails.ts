import { NextApiRequest, NextApiResponse } from 'next';
import { classifyEmailContent } from '@/services/emailservices/classifyemail';

export default async function classifyEmails(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { emailContent, emailSubject } = req.body;

        if (!emailContent || !emailSubject) {
            return res.status(400).json(
                { error: 'Email content and subject are required' }
            );
        }

        await classifyEmailContent(emailContent, emailSubject);
        
        return res.status(200).json({ message: 'Email classified successfully' });
    
    } catch (error) {
        console.error('Error classifying email:', error);
        return res.status(500).json({ error: 'Failed to classify email' });
    }
}
