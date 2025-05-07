// /pages/api/products/[id].tsx

import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const productId = parseInt(req.query.id as string);

  switch (method) {
    case 'GET':
      try {
        const product = await db.select().from(products).where(eq(products.id, productId));

        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
      }
      break;

    case 'PUT':
      try {
        const { name, category, description, price } = req.body;

        // Update product
        const updatedProduct = await db
          .update(products)
          .set({ name, category, description, price })
          .where(eq(products.id, productId))

        if (updatedProduct.length > 0) {
          res.status(200).json(updatedProduct[0]);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
      }
      break;

    case 'DELETE':
      try {
        // Delete product
        const deletedProduct = await db.delete(products).where(eq(products.id, productId));

        if (deletedProduct.length > 0) {
          res.status(204).end();
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
