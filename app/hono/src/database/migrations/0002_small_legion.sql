DROP INDEX "skills_name_unique";--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "description" TO "description" text(200) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `skills_name_unique` ON `skills` (`name`);--> statement-breakpoint
ALTER TABLE `projects` ADD `subDescription` text(2000) NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `shortDescription`;