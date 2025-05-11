import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { quotations } from "@/db/schema";
import { getToken } from "next-auth/jwt";
import { and, desc, eq, isNull } from "drizzle-orm";

const ITEMS_PER_PAGE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const page = parseInt(req.query.page as string) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  switch (method) {
    case "GET":
      try {
        const baseQuery =
          session.type !== "Admin"
            ? db.select().from(quotations).where(isNull(quotations.deletedAt))
            : db
                .select()
                .from(quotations)
                .where(and(eq(quotations.createdBy, parseInt(session.id)), isNull(quotations.deletedAt)));

        const totalItems = await baseQuery.execute();

        const paginatedQuery =
          session.type === "Admin"
            ? db
                .select()
                .from(quotations)
                .where(isNull(quotations.deletedAt))
                .limit(ITEMS_PER_PAGE)
                .offset(offset)
                .orderBy(desc(quotations.createdAt))
            : db
                .select()
                .from(quotations)
                .where(and(eq(quotations.createdBy, parseInt(session.id)), isNull(quotations.deletedAt)))
                .limit(ITEMS_PER_PAGE)
                .offset(offset)
                .orderBy(desc(quotations.createdAt));

        const items = await paginatedQuery.execute();

        const totalPages = Math.ceil(totalItems.length / ITEMS_PER_PAGE);

        res.status(200).json({
          data: items,
          current_page: page,
          last_page: totalPages,
          per_page: ITEMS_PER_PAGE,
          total: totalItems.length,
          from: offset + 1,
          to: offset + items.length,
        });
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.status(500).json({ message: "Error fetching inquiries" });
      }
      break;

    case "POST":
      try {
        const body = req.body;

        const newInquiry = await db.insert(quotations).values({
          ...body,
          createdBy: parseInt(session.id),
        });

        res.status(201).json(newInquiry);
      } catch (error) {
        console.error("Error creating inquiry:", error);
        res.status(500).json({ message: "Error creating inquiry" });
      }
      break;

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
