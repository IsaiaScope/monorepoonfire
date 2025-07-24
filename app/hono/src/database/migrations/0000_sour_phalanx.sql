CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skills_name_unique` ON `skills` (`name`);--> statement-breakpoint
CREATE TABLE `work-experience` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`language` text(50) NOT NULL,
	`name` text(100) NOT NULL,
	`company` text(100) NOT NULL,
	`location` text(100) NOT NULL,
	`description` text(1000) NOT NULL,
	`shortDescription` text(200) NOT NULL,
	`startDate` text(50) NOT NULL,
	`endDate` text(50) NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL
);
