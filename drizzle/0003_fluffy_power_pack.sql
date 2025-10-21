CREATE TABLE `auditLogs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` varchar(64),
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disputes` (
	`id` varchar(64) NOT NULL,
	`claimId` varchar(64) NOT NULL,
	`reportId` varchar(64) NOT NULL,
	`reporterId` varchar(64) NOT NULL,
	`respondentId` varchar(64) NOT NULL,
	`reason` enum('fraud','fake_item','not_cooperative','threatening','wrong_item','payment_issue','other') NOT NULL,
	`description` text NOT NULL,
	`evidence` text,
	`status` enum('pending','under_review','resolved_reporter','resolved_respondent','resolved_split','dismissed') NOT NULL DEFAULT 'pending',
	`assignedTo` varchar(64),
	`resolution` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `disputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','moderator','admin','super_admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `auditLogs` ADD CONSTRAINT `auditLogs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_claimId_claims_id_fk` FOREIGN KEY (`claimId`) REFERENCES `claims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_reporterId_users_id_fk` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_respondentId_users_id_fk` FOREIGN KEY (`respondentId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_assignedTo_users_id_fk` FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `userId_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `action_idx` ON `auditLogs` (`action`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `claimId_idx` ON `disputes` (`claimId`);--> statement-breakpoint
CREATE INDEX `reportId_idx` ON `disputes` (`reportId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `disputes` (`status`);--> statement-breakpoint
CREATE INDEX `assignedTo_idx` ON `disputes` (`assignedTo`);