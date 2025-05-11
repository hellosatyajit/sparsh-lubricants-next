// /pages/api/products/[id].tsx

import { db } from '@/db';
import { products, quotationTemplate, quotationTemplatesProducts } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const templateId = parseInt(req.query.id as string);

    switch (method) {
        case 'GET':
            try {
                const quotation = await db.select().from(quotationTemplate).leftJoin(quotationTemplatesProducts, eq(quotationTemplate.id, quotationTemplatesProducts.quotationTemplateId)).where(and(eq(quotationTemplatesProducts.quotationTemplateId, templateId), isNull(quotationTemplatesProducts.deletedAt))).limit(1);

                const mapped = Object.values(
                    quotation.reduce((acc, { quotation_template, quotation_templates_products }) => {
                        const templateId = quotation_template.id;

                        // @ts-ignore
                        if (!acc[templateId]) {
                            // @ts-ignore
                            acc[templateId] = {
                                id: templateId,
                                name: quotation_template.name,
                                products: [],
                            };
                        }

                        // @ts-ignore
                        acc[templateId].products.push({
                            // @ts-ignore
                            id: quotation_templates_products.id,
                            // @ts-ignore
                            name: quotation_templates_products.name,
                            // @ts-ignore
                            price: parseFloat(quotation_templates_products.price),
                            // @ts-ignore
                            quantity: quotation_templates_products.quantity,
                        });

                        return acc;
                    }, {})
                );

                if (mapped) {
                    res.status(200).json(mapped);
                } else {
                    res.status(404).json({ message: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Error fetching product' });
            }
            break;

        case 'PUT':
            try {
                const { name, products } = req.body;

                await db.transaction(async (tx) => {
                    const newQuotationTemplate = await tx.update(quotationTemplate).set({ name }).where(eq(quotationTemplate.id, Number(templateId)));

                    for (const product of products) {
                        const exist = await tx.select().from(quotationTemplatesProducts).where(eq(quotationTemplatesProducts.id, product.id)).limit(1);
                        if (exist.length > 0) {
                            await tx.update(quotationTemplatesProducts).set({ name: product.name, price: product.price, quantity: product.quantity }).where(eq(quotationTemplatesProducts.id, product.id));
                        } else {
                            await tx.insert(quotationTemplatesProducts).values({
                                quotationTemplateId: Number(templateId),
                                name: product.name,
                                price: product.price,
                                quantity: product.quantity,
                            });
                        }
                    }
                })

                res.status(200).json({ message: 'Quotation updated' });

            } catch (error) {
                res.status(500).json({ message: 'Error deleting quotation' });
            }
            break;

        case 'DELETE':
            try {
                const deletedQuotation = await db.update(quotationTemplate).set({ deletedAt: new Date() }).where(eq(quotationTemplate.id, Number(templateId)));

                if (deletedQuotation.length > 0) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ message: 'Quotation not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Error deleting quotation' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}
