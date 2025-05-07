import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { mailAccounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  switch (method) {
    case 'PATCH':
      try {
        const body = req.body;

        const updatedMailAccount = await db.update(mailAccounts)
          .set(body)
          .where(eq(mailAccounts.id, id));

        res.status(200).json(updatedMailAccount);
      } catch (error) {
        console.error('Error updating mail account:', error);
        res.status(500).json({ message: 'Error updating mail account' });
      }
      break;

    case 'DELETE':
      try {
        await db.delete(mailAccounts)
          .where(eq(mailAccounts.id, id));

        res.status(200).json({ message: 'Mail account deleted successfully' });
      } catch (error) {
        console.error('Error deleting mail account:', error);
        res.status(500).json({ message: 'Error deleting mail account' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
} 