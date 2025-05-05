CREATE TABLE `other_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
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
CREATE TABLE `sales_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
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
DROP TABLE `clients`;--> statement-breakpoint
DROP TABLE `emails`;--> statement-breakpoint
DROP TABLE `inquiries`;--> statement-breakpoint
DROP TABLE `invoices`;--> statement-breakpoint
DROP TABLE `logs`;--> statement-breakpoint
DROP TABLE `mail_accounts`;--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
DROP TABLE `quotation_items`;--> statement-breakpoint
DROP TABLE `quotations`;--> statement-breakpoint
DROP TABLE `users`;