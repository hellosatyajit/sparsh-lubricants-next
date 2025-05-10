import nodemailer from 'nodemailer';
import { db } from '@/db';
import { mailAccounts, quotations, salesInquiries, emails } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function sendQuotationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { quotationId } = req.body;

  if (!quotationId) return res.status(400).json({ error: 'Missing required fields' });

  try {
    // Fetch quotation
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, quotationId));
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    // Fetch inquiry
    const [inquiry] = await db.select().from(salesInquiries).where(eq(salesInquiries.id, quotation.inquiryId));
    if (!inquiry) return res.status(404).json({ error: 'Related inquiry not found' });


    // Fetch sender
    const [sender] = await db.select().from(mailAccounts).where(eq(mailAccounts.id, emails.fromEmail));
    if (!sender || !sender.email || !sender.appCode) {
      return res.status(400).json({ error: 'Sender mail account is invalid or missing' });
    }

    // Set up SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: sender.email,
        pass: sender.appCode,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: sender.email,
      to: inquiry.senderEmail as string,
      subject: 'Your Quotation',
      text: quotation.totalAmount, // Or HTML, as needed
    });

    return res.status(200).json({ message: 'Quotation sent successfully' });
  } catch (err) {
    console.error('Error sending quotation:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
