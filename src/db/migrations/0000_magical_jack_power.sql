CREATE TABLE `file` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` integer NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer NOT NULL,
	`attachmentUrl` text NOT NULL
);
