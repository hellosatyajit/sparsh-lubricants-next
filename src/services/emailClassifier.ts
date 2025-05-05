import { db } from '@/db';
import { emails, clients } from '@/db/schema'; // Fixed import
import { eq } from 'drizzle-orm';

export async function classifyAndStoreEmail(
  subject: string,
  body: string,
  from: string
) {
  // 1. Classify email
  const isInquiry = /inquiry|price|quote/i.test(subject + body);

  // 2. Upsert client
  const [client] = await db.insert(clients)
    .values({
      email: from,
      firstName: from.split('@')[0] || 'Unknown',
      lastName: '',
      address: ''
    })
    .onDuplicateKeyUpdate({ 
      set: { email: from } 
    });

  // 3. Store email
  await db.insert(emails).values({
    subject,
    body,
    isInquiry,
    clientId: client.insertId,
  });

  return isInquiry;
}