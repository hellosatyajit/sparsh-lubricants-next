// /pages/api/products/[id].tsx

import { db } from '@/db';
import { users } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const userId = parseInt(req.query.id as string);

  switch (method) {
    case 'GET':
      try {
        const user = await db.select({
          id: users.id,
          name: users.name,
          type: users.type,
          email: users.email,
        }).from(users).where(and(eq(users.id, userId), isNull(users.deletedAt)));

        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
      }
      break;

    case 'PATCH':
      try {
        const body = req.body;

        const updatedProduct = await db
          .update(users)
          .set(body)
          .where(eq(users.id, userId))

        if (updatedProduct.length > 0) {
          res.status(200).json(updatedProduct[0]);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
      }
      break;

    case 'DELETE':
      try {
        const deletedProduct = await db.update(users).set({
          deletedAt: new Date(),
        }).where(eq(users.id, userId));

        if (deletedProduct.length > 0) {
          res.status(204).end();
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
