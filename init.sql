DROP DATABASE IF EXISTS `community`;
CREATE DATABASE `community`;

USE `community`;

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
	`post_id`	BIGINT	NOT NULL,
	`member_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(50)	NOT NULL,
	`content`	TEXT	NOT NULL,
	`view_cnt`	BIGINT	NOT NULL,
	`like_cnt`	BIGINT	NOT NULL,
	`comment_cnt`	BIGINT	NOT NULL,
	`created_at`	DATETIME	NOT NULL,
	`updated_at`	DATETIME	NULL,
	`img`	VARCHAR(255)	NULL
);

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
	`member_id`	BIGINT	NOT NULL,
	`email`	VARCHAR(100)	NOT NULL,
	`password`	VARCHAR(60)	NOT NULL,
	`nickname`	VARCHAR(30)	NOT NULL,
	`img`	VARCHAR(255)	NULL,
	`created_at`	DATETIME	NOT NULL
);

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
	`comment_id`	BIGINT	NOT NULL,
	`post_id`	BIGINT	NOT NULL,
	`member_id`	BIGINT	NOT NULL,
	`content`	TEXT	NOT NULL,
	`created_at`	DATETIME	NOT NULL,
	`updated_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `like`;

CREATE TABLE `like` (
	`like_id`	BIGINT	NOT NULL,
	`member_id`	BIGINT	NOT NULL,
	`post_id`	BIGINT	NOT NULL
);

ALTER TABLE post
MODIFY COLUMN post_id BIGINT AUTO_INCREMENT,
ADD PRIMARY KEY (post_id);

ALTER TABLE `member`
MODIFY COLUMN `member_id` BIGINT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`member_id`);

ALTER TABLE `comment`
MODIFY COLUMN `comment_id` BIGINT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`comment_id`);

ALTER TABLE `like`
MODIFY COLUMN `like_id` BIGINT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`like_id`);

-- Member 테이블 데이터
INSERT INTO `member` (`member_id`, `email`, `password`, `nickname`, `img`, `created_at`)
VALUES
    (1, '탈퇴회원', '탈퇴회원', '탈퇴회원', '/uploads/profiles/default.jpg', '2024-11-01 10:00:00')
