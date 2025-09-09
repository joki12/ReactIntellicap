CREATE TABLE `activities` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text(150) NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`location` text(200) NOT NULL,
	`capacity` integer NOT NULL,
	`registered_count` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`email` text(150) NOT NULL,
	`subject` text(200) NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text(36),
	`name` text(100) NOT NULL,
	`email` text(150) NOT NULL,
	`type` text NOT NULL,
	`amount` real,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text(150) NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`category` text(100),
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `participations` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text(36) NOT NULL,
	`activity_id` text(36) NOT NULL,
	`status` text DEFAULT 'registered' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text(150) NOT NULL,
	`description` text NOT NULL,
	`domain` text(100) NOT NULL,
	`status` text DEFAULT 'upcoming' NOT NULL,
	`participants` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `space_requests` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text(36),
	`name` text(100) NOT NULL,
	`email` text(150) NOT NULL,
	`type` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`email` text(150) NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);