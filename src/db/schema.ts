import { mysqlTable, varchar, int, boolean, datetime, text } from 'drizzle-orm/mysql-core';

export const salesInquiries = mysqlTable('sales_inquiries', {
  id: int('id').primaryKey().autoincrement(),
  message_id: varchar('message_id', { length: 255 }),
  sender_email: varchar('sender_email', { length: 255 }),
  sender_name: varchar('sender_name', { length: 255 }),
  company_name: varchar('company_name', { length: 255 }),
  mobile_number: varchar('mobile_number', { length: 50 }),
  email_subject: varchar('email_subject', { length: 255 }),
  email_summary: text('email_summary'),
  extracted_json: text('extracted_json'),
  email_raw: text('email_raw'),
  email_date: datetime('email_date'),
  inquiry_type: varchar('inquiry_type', { length: 100 }),
  inquiry_reason: varchar('inquiry_reason',{ length: 100 }),  
  is_inquiry: boolean('is_inquiry'),
});

export const otherMessages = mysqlTable('other_messages', {
  id: int('id').primaryKey().autoincrement(),
  message_id: varchar('message_id', { length: 255 }),
  sender_email: varchar('sender_email', { length: 255 }),
  sender_name: varchar('sender_name', { length: 255 }),
  email_subject: varchar('email_subject', { length: 255 }),
  email_summary: text('email_summary'),
  extracted_json: text('extracted_json'),
  email_raw: text('email_raw'),
  email_date: datetime('email_date'),
  inquiry_type: varchar('inquiry_type', { length: 100 }),
  is_inquiry: boolean('is_inquiry'),
});
