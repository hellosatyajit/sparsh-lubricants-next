// /pages/api/quotations/[id].tsx

import { db } from '@/db';
import { quotationTemplate, quotationTemplatesProducts } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const quotation = await db.select().from(quotationTemplate).leftJoin(quotationTemplatesProducts, eq(quotationTemplate.id, quotationTemplatesProducts.quotationTemplateId)).where(isNull(quotationTemplate.deletedAt));

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
                    res.status(404).json({ message: 'Quotation templates not found' });
                }
            } catch (error) {
                console.log(error);

                res.status(500).json({ message: 'Error fetching quotation templates' });
            }
            break;

        case 'POST':
            try {
                const { name, products } = req.body;

                await db.transaction(async (tx) => {
                    const newQuotationTemplate = await tx.insert(quotationTemplate).values({ name }).$returningId();

                    await tx.insert(quotationTemplatesProducts).values(
                        products.map((product: typeof quotationTemplatesProducts) => ({
                            quotationTemplateId: newQuotationTemplate[0].id,
                            name: product.name,
                            quantity: product.quantity,
                            price: product.price,
                        }))
                    );
                })

                res.status(200).json({ message: 'Quotation template created successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error updating quotation templates' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}
