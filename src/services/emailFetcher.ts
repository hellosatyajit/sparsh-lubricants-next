// src/services/emailFetcher.ts
import { ImapFlow } from 'imapflow';
import { classifyAndStoreEmail } from './emailClassifier';

const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_APP_PASSWORD!
  },
  logger: false
});

export async function fetchEmails() {
  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    // Correct fetch query for unread messages
    const messages = client.fetch('1:*', {
      envelope: true,
      source: true,
      flags: true // This enables flag checking (not the filter)
    });

    for await (const message of messages) {
      // Check if message is UNSEEN (not read)
      if (message.flags?.has('\\Seen')) {
        continue; // Skip already read messages
      }

      const subject = message.envelope?.subject || '(No Subject)';
      const from = message.envelope?.from?.[0]?.address;
      
      if (!from) {
        console.warn('Skipping email with no sender address');
        continue;
      }

      let body = '';
      if (typeof message.source === 'string') {
        body = message.source;
      } else if (message.source instanceof Buffer) {
        body = message.source.toString('utf-8');
      }

      await classifyAndStoreEmail(subject, body, from);
    }

    lock.release();
  } catch (error) {
    console.error('Email fetch error:', error);
  } finally {
    await client.logout();
  }
}

// Run every 5 minutes
setInterval(fetchEmails, 300000);