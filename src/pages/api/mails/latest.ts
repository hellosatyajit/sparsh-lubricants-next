import { db } from "@/db";
import { mailAccounts, otherMessages, salesInquiries } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import imaps from "imap-simple";
import { subHours } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { classifyEmailContent } from "@/services/emailservices/classifyemail";

const getEmailsFromAccount = async ({
  email,
  appCode,
}: {
  email: string;
  appCode: string;
}) => {
  const config = {
    imap: {
      user: email,
      password: appCode,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
      authTimeout: 10000,
    },
  };

  try {
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const delay = subHours(new Date(), 1).toISOString();
    const searchCriteria = [["SINCE", delay]];
    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: false,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    if (messages.length === 0) return null;

    return messages;
  } catch (err: any) {
    console.error(`IMAP error for ${email}:`, err.message);
    return null;
  }
};

async function checkExistingEmail(messageIds: string[]) {
  const [salesInquiriesMails, otherMessagesMails] = await Promise.all([
    db
      .select()
      .from(salesInquiries)
      .where(inArray(salesInquiries.messageId, messageIds)),
    db
      .select()
      .from(otherMessages)
      .where(inArray(otherMessages.messageId, messageIds)),
  ]);
  
  return [...salesInquiriesMails, ...otherMessagesMails].map(
    (message) => message.messageId
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const activeAccounts = await db
      .select()
      .from(mailAccounts)
      .where(eq(mailAccounts.status, "Active"));

    const emailFetchPromises = activeAccounts.map((account) =>
      getEmailsFromAccount({ email: account.email, appCode: account.appCode! })
    );

    const emails = await Promise.all(emailFetchPromises);

    let validEmails = emails.filter(Boolean);

    validEmails = validEmails.flatMap((messages: any) => messages);

    const mappedIds = validEmails
      .map((message: any) => {
        const header = message.parts.find(
          (part: any) => part.which === "HEADER"
        ).body;
        return header["message-id"][0].replace(/<|>/g, "");
      })
      .filter(Boolean) as string[];

    const existingEmails = await checkExistingEmail(mappedIds);

    validEmails = validEmails.filter((message: any) => {
      const header = message.parts.find(
        (part: any) => part.which === "HEADER"
      ).body;
      const id = header["message-id"][0].replace(/<|>/g, "");
      
      return !existingEmails.includes(id);
    });

    const formattedEmails = await Promise.all(
      validEmails.map(async (message: any) => {
        return await classifyEmailContent(message);
      })
    );

    return res.status(200).json(formattedEmails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
