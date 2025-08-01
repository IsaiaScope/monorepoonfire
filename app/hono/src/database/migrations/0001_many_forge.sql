CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`language` text(50) NOT NULL,
	`description` text(1000) NOT NULL,
	`shortDescription` text(200) NOT NULL,
	`href` text(200) NOT NULL,
	`repo` text(200) NOT NULL,
	`image` text(200) NOT NULL,
	`title` text(100) NOT NULL,
	`tags` text(500) NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL
);
