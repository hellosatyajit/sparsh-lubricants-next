import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { mailAccounts } from '@/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const mailAccountsData = await db.select({
          id: mailAccounts.id,
          email: mailAccounts.email,
          status: mailAccounts.status,
          appCode: mailAccounts.appCode,
        }).from(mailAccounts);        

        res.status(200).json(mailAccountsData);
      } catch (error) {
        console.error('Error fetching mail accounts:', error);
        res.status(500).json({ message: 'Error fetching mail accounts' });
      }
      break;

    case 'POST':
      try {
        const { email, status, appCode } = req.body;

        const newMailAccount = await db.insert(mailAccounts).values({
          email,
          status,
          appCode,
        });

        res.status(201).json(newMailAccount);
      } catch (error) {
        console.error('Error creating mail account:', error);
        res.status(500).json({ message: 'Error creating mail account' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
} 