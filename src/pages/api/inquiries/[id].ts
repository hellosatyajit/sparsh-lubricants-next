import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { salesInquiries } from "@/db/schema";
import { getToken } from "next-auth/jwt";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const inquiryId = parseInt(req.query.id as string);

  // Check if the user has access to this inquiry
  const inquiry = await db
    .select()
    .from(salesInquiries)
    .where(eq(salesInquiries.id, inquiryId))
    .execute();

  if (!inquiry.length) {
    return res.status(404).json({ message: "Inquiry not found" });
  }

  // Only allow access if user is admin or the inquiry is assigned to them
  if (
    session.type !== "Admin" &&
    inquiry[0].assignedTo !== parseInt(session.id)
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  switch (method) {
    case "GET":
      res.status(200).json(inquiry[0]);
      break;

    case "PATCH":
      try {
        const body = req.body;

        await db
          .update(salesInquiries)
          .set({
            ...body,
          })
          .where(eq(salesInquiries.id, inquiryId));

        res.status(200).json({ message: "Inquiry updated successfully" });
      } catch (error) {
        console.error("Error updating inquiry:", error);
        res.status(500).json({ message: "Error updating inquiry" });
      }
      break;

    case "DELETE":
      try {
        // Only admins can delete inquiries
        if (session.type !== "Admin") {
          return res
            .status(403)
            .json({ message: "Only admins can delete inquiries" });
        }

        await db
          .delete(salesInquiries)
          .where(eq(salesInquiries.id, inquiryId))
          .execute();

        res.status(204).end();
      } catch (error) {
        console.error("Error deleting inquiry:", error);
        res.status(500).json({ message: "Error deleting inquiry" });
      }
      break;

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
