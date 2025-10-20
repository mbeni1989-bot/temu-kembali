CREATE TABLE `chats` (
	`id` varchar(64) NOT NULL,
	`reportId` varchar(64) NOT NULL,
	`claimId` varchar(64),
	`user1Id` varchar(64) NOT NULL,
	`user2Id` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`lastMessageAt` timestamp DEFAULT (now()),
	`isActive` boolean DEFAULT true,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `claims` (
	`id` varchar(64) NOT NULL,
	`reportId` varchar(64) NOT NULL,
	`claimantId` varchar(64) NOT NULL,
	`message` text,
	`status` enum('pending','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	`verificationDetails` text,
	`completedAt` timestamp,
	CONSTRAINT `claims_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(64) NOT NULL,
	`reportId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	`isFlagged` boolean DEFAULT false,
	`flagReason` text,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`chatId` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`messageType` enum('text','image','system') NOT NULL DEFAULT 'text',
	`createdAt` timestamp DEFAULT (now()),
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`isFlagged` boolean DEFAULT false,
	`flagReason` text,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('new_claim','claim_accepted','claim_rejected','new_message','new_comment','potential_match','report_resolved','new_report_nearby') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`reportId` varchar(64),
	`claimId` varchar(64),
	`chatId` varchar(64),
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reportFlags` (
	`id` varchar(64) NOT NULL,
	`reportId` varchar(64) NOT NULL,
	`reporterId` varchar(64) NOT NULL,
	`reason` enum('fake','spam','inappropriate','duplicate','resolved','other') NOT NULL,
	`description` text,
	`status` enum('pending','reviewed','dismissed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	`reviewedAt` timestamp,
	`reviewedBy` varchar(64),
	CONSTRAINT `reportFlags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('lost_item','found_item','lost_person','find_person') NOT NULL,
	`category` enum('barang','hewan','kendaraan','orang') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`locationName` text,
	`locationLat` varchar(50),
	`locationLng` varchar(50),
	`city` varchar(100),
	`province` varchar(100),
	`incidentDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	`itemBrand` varchar(100),
	`itemColor` varchar(100),
	`itemModel` varchar(100),
	`animalType` varchar(100),
	`animalBreed` varchar(100),
	`animalName` varchar(100),
	`vehicleType` varchar(50),
	`vehiclePlate` varchar(20),
	`personName` varchar(255),
	`personNickname` varchar(100),
	`personAge` int,
	`personGender` enum('male','female'),
	`personHeight` int,
	`personWeight` int,
	`personPhysicalFeatures` text,
	`personLastWearing` text,
	`personRelationship` varchar(100),
	`personLastKnownInfo` text,
	`policeReportNumber` varchar(100),
	`images` text,
	`status` enum('active','resolved','closed') NOT NULL DEFAULT 'active',
	`resolvedAt` timestamp,
	`hasReward` boolean DEFAULT false,
	`rewardAmount` int,
	`isPublished` boolean DEFAULT true,
	`isFlagged` boolean DEFAULT false,
	`flagReason` text,
	`viewCount` int DEFAULT 0,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `location` text;--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `verificationDocUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `reputationScore` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_claimId_claims_id_fk` FOREIGN KEY (`claimId`) REFERENCES `claims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_user1Id_users_id_fk` FOREIGN KEY (`user1Id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_user2Id_users_id_fk` FOREIGN KEY (`user2Id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `claims` ADD CONSTRAINT `claims_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `claims` ADD CONSTRAINT `claims_claimantId_users_id_fk` FOREIGN KEY (`claimantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_chatId_chats_id_fk` FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_claimId_claims_id_fk` FOREIGN KEY (`claimId`) REFERENCES `claims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_chatId_chats_id_fk` FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reportFlags` ADD CONSTRAINT `reportFlags_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reportFlags` ADD CONSTRAINT `reportFlags_reporterId_users_id_fk` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reportFlags` ADD CONSTRAINT `reportFlags_reviewedBy_users_id_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `reportId_idx` ON `chats` (`reportId`);--> statement-breakpoint
CREATE INDEX `user1Id_idx` ON `chats` (`user1Id`);--> statement-breakpoint
CREATE INDEX `user2Id_idx` ON `chats` (`user2Id`);--> statement-breakpoint
CREATE INDEX `reportId_idx` ON `claims` (`reportId`);--> statement-breakpoint
CREATE INDEX `claimantId_idx` ON `claims` (`claimantId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `claims` (`status`);--> statement-breakpoint
CREATE INDEX `reportId_idx` ON `comments` (`reportId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `comments` (`userId`);--> statement-breakpoint
CREATE INDEX `chatId_idx` ON `messages` (`chatId`);--> statement-breakpoint
CREATE INDEX `senderId_idx` ON `messages` (`senderId`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `isRead_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `notifications` (`createdAt`);--> statement-breakpoint
CREATE INDEX `reportId_idx` ON `reportFlags` (`reportId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `reportFlags` (`status`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `reports` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `reports` (`type`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `reports` (`category`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `reports` (`status`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `reports` (`city`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `reports` (`createdAt`);