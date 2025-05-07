// /pages/api/products/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { products } from '@/db/schema';

// Fetch all products with pagination and create a new product
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const page = parseInt(req.query.page as string) || 1;
      const perPage = 10;
      const offset = (page - 1) * perPage;

      try {
        const productsData = await db.select().from(products).limit(perPage).offset(offset);
        const totalCount = await db.$count(products);

        const total = totalCount;
        res.status(200).json({
          data: productsData,
          current_page: page,
          last_page: Math.ceil(total / perPage),
          per_page: perPage,
          total,
          from: offset + 1,
          to: offset + productsData.length,
        });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
      }
      break;

    case 'POST':
      try {
        const { name, category, description, price } = req.body;

        const newProduct = await db.insert(products).values({
          name,
          category,
          description,
          price,
        });

        res.status(201).json(newProduct);
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
