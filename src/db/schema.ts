// src/db/schema.ts
import {
  mysqlTable,
  serial,
  varchar,
  text,
  datetime,
  int,
  decimal,
  boolean,
  index,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 20 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
}, (table) => ({
  nameIdx: index('users_name_idx').on(table.name),
}));

export const clients = mysqlTable('clients', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  phoneNo: varchar('phone_no', { length: 20 }),
  address: text('address'),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
}, (table) => ({
  emailIdx: index('clients_email_idx').on(table.email),
}));

export const mailAccounts = mysqlTable('mail_accounts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
  deletedAt: datetime('deleted_at', { mode: 'date' }),
});

export const inquiries = mysqlTable('inquiries', {
  id: serial('id').primaryKey(),
  clientId: int('client_id').notNull().references(() => clients.id),
  assignedToId: int('assigned_to_id').references(() => users.id),
  mailAccountId: int('mail_account_id').references(() => mailAccounts.id),
  status: varchar('status', { length: 20 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
}, (table) => ({
  clientIdx: index('inquiries_client_idx').on(table.clientId),
  statusIdx: index('inquiries_status_idx').on(table.status),
}));

export const quotations = mysqlTable('quotations', {
  id: serial('id').primaryKey(),
  clientId: int('client_id').notNull().references(() => clients.id),
  createdById: int('created_by_id').notNull().references(() => users.id),
  expiryDate: datetime('expiry_date', { mode: 'date' }).notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
  deletedAt: datetime('deleted_at', { mode: 'date' }),
});

export const quotationItems = mysqlTable('quotation_items', {
  id: serial('id').primaryKey(),
  quotationId: int('quotation_id').notNull().references(() => quotations.id),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: int('quantity').notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
  deletedAt: datetime('deleted_at', { mode: 'date' }),
});

export const invoices = mysqlTable('invoices', {
  id: serial('id').primaryKey(),
  quotationId: int('quotation_id').notNull().references(() => quotations.id),
  inquiryId: int('inquiry_id').notNull().references(() => inquiries.id),
  dueDate: datetime('due_date', { mode: 'date' }).notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
  deletedAt: datetime('deleted_at', { mode: 'date' }),
});

export const payments = mysqlTable('payments', {
  id: serial('id').primaryKey(),
  invoiceId: int('invoice_id').notNull().references(() => invoices.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  fromAccount: varchar('from_account', { length: 100 }),
  toAccount: varchar('to_account', { length: 100 }),
  paymentDate: datetime('payment_date', { mode: 'date' }).notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
  deletedAt: datetime('deleted_at', { mode: 'date' }),
});

export const logs = mysqlTable('logs', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  recordId: int('record_id').notNull(),
  previousValue: text('previous_value'),
  currentValue: text('current_value'),
  timestamp: datetime('timestamp', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
});

export const emails = mysqlTable('emails', {
  id: serial('id').primaryKey(),
  subject: varchar('subject', { length: 255 }),
  body: text('body'),
  isInquiry: boolean('is_inquiry').default(false),
  clientId: int('client_id').notNull().references(() => clients.id),
  createdAt: datetime('created_at', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
});
