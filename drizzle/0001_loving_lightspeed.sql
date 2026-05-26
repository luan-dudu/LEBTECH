CREATE TABLE `consulting_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`company` varchar(255) NOT NULL,
	`consultingType` varchar(100) NOT NULL,
	`currentChallenges` text NOT NULL,
	`objectives` text NOT NULL,
	`teamSize` varchar(50),
	`budget` varchar(100),
	`status` enum('pending','scheduled','in_progress','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consulting_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','read','responded','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment_sales_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`company` varchar(255) NOT NULL,
	`equipmentType` varchar(100) NOT NULL,
	`quantity` int NOT NULL,
	`specifications` text NOT NULL,
	`budget` varchar(100),
	`timeline` varchar(50) NOT NULL,
	`status` enum('pending','quoted','negotiating','closed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipment_sales_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technical_support_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`company` varchar(255) NOT NULL,
	`problemType` varchar(50) NOT NULL,
	`urgency` varchar(50) NOT NULL,
	`description` text NOT NULL,
	`status` enum('pending','in_progress','resolved','closed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `technical_support_requests_id` PRIMARY KEY(`id`)
);
