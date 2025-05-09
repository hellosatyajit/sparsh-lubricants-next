import { db } from '@/db';
import { mailAccounts, otherMessages, salesInquiries } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { simpleParser } from 'mailparser';
import imaps from 'imap-simple';
import { subHours } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';
import { classifyEmailContent } from '@/services/emailservices/classifyemail';

const getEmailsFromAccount = async ({ email, appCode }: { email: string, appCode: string }) => {
    console.log(appCode);

    const config = {
        imap: {
            user: email,
            password: appCode,
            host: 'imap.gmail.com', // Adjust as per provider
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
        await connection.openBox('INBOX');

        const delay = subHours(new Date(), 1).toISOString();
        const searchCriteria = [['SINCE', delay]];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(JSON.stringify(messages, null, 2));
        
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
    return [...salesInquiriesMails, ...otherMessagesMails].map((message: any) => message.messageId);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const activeAccounts = await db
            .select()
            .from(mailAccounts)
            .where(eq(mailAccounts.status, 'Active'));

        const emailFetchPromises = activeAccounts.map(account =>
            getEmailsFromAccount({ email: account.email, appCode: account.appCode! })
        );

        const emails = await Promise.all(emailFetchPromises);

        let validEmails = emails.filter(Boolean);

        validEmails = validEmails.flatMap((messages: any) => messages);

        // validEmails = (validEmails.map((message: any) => {
        //     const header = message.parts.find((part: any) => part.which === 'HEADER').body;
        //     return header['message-id'][0].replace(/<|>/g, '');
        // }).filter(Boolean) as string[]);

        // const existingEmails = await checkExistingEmail(validEmails);

        const formattedEmails = await Promise.all(
            validEmails.map(async (message: any) => {
                return await classifyEmailContent(message);
            }
            ));

        return res.status(200).json(formattedEmails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


// import { db } from '@/db';
// import { mailAccounts, otherMessages, salesInquiries } from '@/db/schema';
// import { eq, inArray } from 'drizzle-orm';
// import { simpleParser, ParsedMail } from 'mailparser';
// import imaps from 'imap-simple';
// import { subHours } from 'date-fns';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { classifyEmailContent } from '@/services/emailservices/classifyemail';

// interface EmailAccount {
//   email: string;
//   appCode: string;
// }

// interface ProcessedEmail {
//   messageId: string;
//   senderEmail: string;
//   senderName: string;
//   emailSubject: string;
//   emailText: string;
//   emailHtml: string;
//   headers: Record<string, unknown>;
//   date: string;
// }

// interface ImapMessagePart {
//   which: string;
//   body?: string;
// }

// const getEmailsFromAccount = async ({ email, appCode }: EmailAccount): Promise<ProcessedEmail[] | null> => {
//   const config = {
//     imap: {
//       user: email,
//       password: appCode,
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//       tlsOptions: {
//         rejectUnauthorized: false,
//       },
//       authTimeout: 10000,
//     },
//   };

//   try {
//     const connection = await imaps.connect(config);
//     await connection.openBox('INBOX');

//     const delay = subHours(new Date(), 1).toISOString();
//     const searchCriteria = [['SINCE', delay]];
//     const fetchOptions = {
//       bodies: ['HEADER', 'TEXT', 'HTML'],
//       markSeen: false,
//       struct: true
//     };

//     const messages = await connection.search(searchCriteria, fetchOptions);
//     console.log(`📥 [${email}] Fetched ${messages.length} emails from IMAP`);

//     if (messages.length === 0) return null;

//     const processedMessages: ProcessedEmail[] = [];

//     for (const message of messages) {
//       try {
//         const header = message.parts.find((part: ImapMessagePart) => part.which === 'HEADER')?.body as Record<string, string[]>;
//         const textPart = message.parts.find((part: ImapMessagePart) => part.which === 'TEXT');
//         const htmlPart = message.parts.find((part: ImapMessagePart) => part.which === 'HTML');

//         const parsed: ParsedMail = await simpleParser(
//           textPart?.body || htmlPart?.body || ''
//         );

//         if (!header || !header['message-id']) {
//           console.warn(`[${email}] ⚠️ Missing message-id in headers`);
//           continue;
//         }

//         console.log(`✉️ [${email}] Parsed: "${parsed.subject}" from ${parsed.from?.text}`);

//         processedMessages.push({
//             messageId: header['message-id']?.[0]?.replace(/<|>/g, '') ?? '',
//             senderEmail: parsed.from?.value[0].address || '',
//             senderName: parsed.from?.value[0].name || '',
//             emailSubject: parsed.subject || '',
//             emailText: parsed.text || '',
//             emailHtml: parsed.html || '',
//             headers: Object.fromEntries(parsed.headers.entries()),
//             date: parsed.date?.toISOString() || new Date().toISOString()
//           });
//       } catch (parseError: unknown) {
//         console.error(`❌ [${email}] Error parsing message:`, parseError instanceof Error ? parseError.message : String(parseError));
//       }
//     }

//     connection.end();
//     return processedMessages.length > 0 ? processedMessages : null;
//   } catch (err: unknown) {
//     console.error(`❌ [${email}] IMAP error:`, err instanceof Error ? err.message : String(err));
//     return null;
//   }
// };

// async function checkExistingEmail(messageIds: string[]): Promise<string[]> {
//   try {
//     const [salesInquiriesMails, otherMessagesMails] = await Promise.all([
//       db.select()
//         .from(salesInquiries)
//         .where(inArray(salesInquiries.messageId, messageIds)),
//       db.select()
//         .from(otherMessages)
//         .where(inArray(otherMessages.messageId, messageIds)),
//     ]);

//     return [
//       ...salesInquiriesMails.map(m => m.messageId!).filter((id): id is string => id !== null),
//       ...otherMessagesMails.map(m => m.messageId!).filter((id): id is string => id !== null)
//     ];
//   } catch (err: unknown) {
//     console.error('❌ Error checking existing emails:', err instanceof Error ? err.message : String(err));
//     return [];
//   }
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const activeAccounts = await db.select()
//       .from(mailAccounts)
//       .where(eq(mailAccounts.status, 'Active'));

//     const emailProcessingPromises = activeAccounts.map(async (account) => {
//       if (!account.appCode) {
//         console.warn(`⚠️ No appCode for account ${account.email}`);
//         return [];
//       }

//       try {
//         const emails = await getEmailsFromAccount({
//           email: account.email,
//           appCode: account.appCode
//         });

//         if (!emails || emails.length === 0) {
//           console.log(`📭 No new emails found for ${account.email}`);
//           return [];
//         }

//         const messageIds = emails.map(e => e.messageId);
//         const existingIds = await checkExistingEmail(messageIds);
//         const newEmails = emails.filter(e => !existingIds.includes(e.messageId));

//         console.log(`📊 [${account.email}] Total: ${emails.length}, Duplicates: ${existingIds.length}, New: ${newEmails.length}`);

//         if (newEmails.length === 0) return [];

//         const classificationResults = await Promise.all(
//           newEmails.map(async (email) => {
//             try {
//               return await classifyEmailContent(email);
//             } catch (err: unknown) {
//               console.error(
//                 `❌ Error classifying email ${email.messageId}:`,
//                 err instanceof Error ? err.message : String(err)
//               );
//               return null;
//             }
//           })
//         );

//         console.log(`✅ [${account.email}] Classification complete`);
//         return classificationResults.filter((result): result is Exclude<typeof result, null> => result !== null);
//       } catch (err: unknown) {
//         console.error(
//           `❌ Error processing account ${account.email}:`,
//           err instanceof Error ? err.message : String(err)
//         );
//         return [];
//       }
//     });

//     const results = await Promise.all(emailProcessingPromises);
//     const formattedEmails = results.flat();

//     console.log(`✅ All accounts processed. Total emails classified: ${formattedEmails.length}`);

//     return res.status(200).json({
//       success: true,
//       count: formattedEmails.length,
//       emails: formattedEmails
//     });
//   } catch (error: unknown) {
//     console.error(
//       '❌ Handler error:',
//       error instanceof Error ? error.message : String(error)
//     );
//     return res.status(500).json({
//       error: 'Internal Server Error',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// }
