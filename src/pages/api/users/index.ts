// /pages/api/products/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':

      try {
        const usersData = await db.select({
          id: users.id,
          name: users.name,
          type: users.type,
          email: users.email,
        }).from(users);        

        res.status(200).json({
          data: usersData,
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
      }
      break;

    case 'POST':
      try {
        const { name, type, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.insert(users).values({
          name,
          type,
          email,
          password: hashedPassword,
        });

        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
