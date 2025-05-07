CREATE TABLE `clients` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`address` text NOT NULL,
	`phone_no` varchar(20),
	`email` varchar(100) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`subject` varchar(255) NOT NULL,
	`from_email` varchar(100) NOT NULL,
	`body` text NOT NULL,
	`status` enum('Inquiry','Non-Inquiry') NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`assigned_to` int,
	`mail_account_id` int,
	`status` enum('New','In Progress','Closed') NOT NULL,
	`subject` varchar(255),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quotation_id` int NOT NULL,
	`inquiry_id` int NOT NULL,
	`due_date` date NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`record_id` int NOT NULL,
	`previous_value` text,
	`current_value` text,
	`timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mail_accounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(100) NOT NULL,
	`status` enum('Active','Inactive') NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `mail_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `other_messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`message_id` varchar(255),
	`sender_email` varchar(255),
	`sender_name` varchar(255),
	`email_subject` varchar(255),
	`email_summary` text,
	`extracted_json` text,
	`email_raw` text,
	`email_date` datetime,
	`inquiry_type` varchar(100),
	`is_inquiry` boolean,
	CONSTRAINT `other_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`invoice_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('Paid','Unpaid') NOT NULL,
	`from_account` varchar(100),
	`to_account` varchar(100),
	`payment_date` date NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`sku` varchar(100),
	`price` decimal(10,2) NOT NULL,
	`tax_rate` decimal(5,2) DEFAULT 0.00,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `quotation_items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quotation_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`price` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `quotation_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotation_products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quotation_id` int NOT NULL,
	`product_id` int NOT NULL,
	`qt_id` varchar(100),
	`quantity` int NOT NULL DEFAULT 1,
	`unit_price` decimal(10,2) NOT NULL,
	`discount` decimal(5,2) DEFAULT 0.00,
	`total` decimal(12,2) NOT NULL,
	`notes` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quotation_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`created_by` int NOT NULL,
	`expiry_date` date NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_inquiries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`message_id` varchar(255),
	`sender_email` varchar(255),
	`sender_name` varchar(255),
	`company_name` varchar(255),
	`mobile_number` varchar(50),
	`email_subject` varchar(255),
	`email_summary` text,
	`extracted_json` text,
	`email_raw` text,
	`email_date` datetime,
	`inquiry_type` varchar(100),
	`is_inquiry` boolean,
	CONSTRAINT `sales_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` enum('Admin','Sales','Finance') NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
