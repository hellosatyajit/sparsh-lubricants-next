
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const productsData = await db.select().from(products).where(isNull(products.deletedAt));
                res.status(200).json(productsData);
            } catch (error) {
                res.status(500).json({ message: 'Error fetching products' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}
