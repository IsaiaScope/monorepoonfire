DROP INDEX "skills_name_unique";--> statement-breakpoint
ALTER TABLE `work-experience` ALTER COLUMN "shortDescription" TO "shortDescription" text(500) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `skills_name_unique` ON `skills` (`name`);