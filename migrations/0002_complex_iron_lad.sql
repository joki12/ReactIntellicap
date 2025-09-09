DROP TABLE `cancellation_logs`;--> statement-breakpoint
DROP TABLE `project_participations`;--> statement-breakpoint
DROP TABLE `user_blocks`;--> statement-breakpoint
ALTER TABLE `projects` ADD `estimated_duration` text(50);--> statement-breakpoint
ALTER TABLE `projects` ADD `objectives` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `required_skills` text;--> statement-breakpoint
ALTER TABLE `participations` DROP COLUMN `cancelled_at`;