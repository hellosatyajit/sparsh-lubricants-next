CREATE TABLE `clients` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`phone_no` varchar(20),
	`address` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`subject` varchar(255),
	`body` text,
	`is_inquiry` boolean DEFAULT false,
	`client_id` int,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`assigned_to_id` int,
	`mail_account_id` int,
	`status` varchar(20) NOT NULL,
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
	`due_date` datetime NOT NULL,
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
	`status` varchar(20) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `mail_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`invoice_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(20) NOT NULL,
	`from_account` varchar(100),
	`to_account` varchar(100),
	`payment_date` datetime NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
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
CREATE TABLE `quotations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`created_by_id` int NOT NULL,
	`expiry_date` datetime NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `emails` ADD CONSTRAINT `emails_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `clients_email_idx` ON `clients` (`email`);--> statement-breakpoint
CREATE INDEX `inquiries_client_idx` ON `inquiries` (`client_id`);--> statement-breakpoint
CREATE INDEX `inquiries_status_idx` ON `inquiries` (`status`);--> statement-breakpoint
CREATE INDEX `users_name_idx` ON `users` (`name`);