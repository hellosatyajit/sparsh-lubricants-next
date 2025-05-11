import {
  mysqlTable,
  serial,
  varchar,
  text,
  datetime,
  date,
  decimal,
  int,
  mysqlEnum,
  boolean,
  tinyint
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Clients
export const clients = mysqlTable("clients", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  address: text("address").notNull(),
  phoneNo: varchar("phone_no", { length: 20 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Emails
export const emails = mysqlTable("emails", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  fromEmail: varchar("from_email", { length: 100 }).notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["Inquiry", "Non-Inquiry"]).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Invoices
export const invoices = mysqlTable("invoices", {
  id: serial("id").primaryKey(),
  quotationId: int("quotation_id").notNull(),
  inquiryId: int("inquiry_id").notNull(),
  dueDate: date("due_date").notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: datetime("deleted_at"),
});

// Logs
export const logs = mysqlTable("logs", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  recordId: int("record_id").notNull(),
  previousValue: text("previous_value"),
  currentValue: text("current_value"),
  timestamp: datetime("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

// Mail Accounts
export const mailAccounts = mysqlTable('mail_accounts', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 100 }).notNull(),
  appCode: varchar('app_code', { length: 200 }),
  status: mysqlEnum('status', ['Active', 'Inactive']).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: datetime('deleted_at'),
});

// Payments
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  invoiceId: int("invoice_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["Paid", "Unpaid"]).notNull(),
  fromAccount: varchar("from_account", { length: 100 }),
  toAccount: varchar("to_account", { length: 100 }),
  paymentDate: date("payment_date").notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: datetime("deleted_at"),
});

// Quotation Items (deprecated if using quotation_products)


// Users
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  type: mysqlEnum('type', ['Admin', 'Sales', 'Finance']).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: datetime('deleted_at'),
});

// Products
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  sku: varchar("sku", { length: 100 }).unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default(sql`0.00`),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: datetime("deleted_at"),
});
// Quotation Products (join table)
// Other Messages
export const otherMessages = mysqlTable("other_messages", {
  id: serial("id").primaryKey(),
  messageId: varchar("message_id", { length: 255 }),
  senderEmail: varchar("sender_email", { length: 255 }),
  senderName: varchar("sender_name", { length: 255 }),
  emailSubject: varchar("email_subject", { length: 255 }),
  emailSummary: text("email_summary"),
  extractedJson: text("extracted_json"),
  emailRaw: text("email_raw"),
  emailDate: datetime("email_date"),
  inquiryType: varchar("inquiry_type", { length: 100 }),
  isInquiry: boolean("is_inquiry"),
});


// Inquiries
export const salesInquiries = mysqlTable('sales_inquiries', {
  id: int('id').primaryKey().autoincrement(),
  messageId: varchar('message_id', { length: 255 }),
  senderEmail: varchar('sender_email', { length: 255 }),
  senderName: varchar('sender_name', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  mobileNumber: varchar('mobile_number', { length: 50 }),
  emailSubject: varchar('email_subject', { length: 255 }),
  emailSummary: text('email_summary'),
  extractedJson: text('extracted_json'),
  emailRaw: text('email_raw'),
  emailDate: datetime('email_date'),
  inquiryType: varchar('inquiry_type', { length: 100 }),
  isInquiry: tinyint('is_inquiry'),
  assignedTo: int('assigned_to').references(() => users.id),
});



// Quotations Table
export const quotations = mysqlTable("quotations", {
  id: serial("id").primaryKey(),
  clientId: int("client_id").notNull(),
  inquiryId: int("inquiryId").notNull(),
  createdBy: int("created_by").notNull(),
  expiryDate: date("expiry_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('Pending'),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: datetime("deleted_at"),
});

// Quotation Items Table
export const quotationTemplatesProducts = mysqlTable("quotation_templates_products", {
  id: serial("id").primaryKey(), // Auto-incremented ID
  quotationTemplateId: int("quotation_template_id").notNull(), // Foreign key referencing the quotation_template table
  name: varchar("name", { length: 255 }).notNull(), // Name of the product in the template
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price of the product
  quantity: int("quantity").notNull(), // Quantity of the product in the template
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`), // Timestamp for creation
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`), // Timestamp for updates
  deletedAt: datetime("deleted_at"), // Timestamp for soft deletion
});
export const quotationProducts = mysqlTable("quotation_products", {
  id: serial("id").primaryKey(),
  quotationId: int("quotation_id").notNull(),
  productId: int("product_id").notNull(),
  quantity: int("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const quotationTemplate = mysqlTable("quotation_template", {
  id: serial("id").primaryKey(), // Auto-incremented ID
  name: varchar("name", { length: 255 }).notNull(), // Name of the template
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`), // Timestamp for creation
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`), // Timestamp for updates
  deletedAt: datetime("deleted_at"), // Timestamp for soft deletion
});