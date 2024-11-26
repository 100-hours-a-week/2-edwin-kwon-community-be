DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
	`post_id`	BIGINT	NOT NULL,
	`member_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(50)	NOT NULL,
	`content`	TEXT	NOT NULL,
	`view_cnt`	BIGINT	NOT NULL,
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
	`img`	VARCHAR(255)	NULL
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
INSERT INTO `member` (`member_id`, `email`, `password`, `nickname`, `img`)
VALUES
    (1, 'user1@example.com', 'hashedpassword1', 'UserOne', 'user1.jpg'),
    (2, 'user2@example.com', 'hashedpassword2', 'UserTwo', 'user2.jpg'),
    (3, 'user3@example.com', 'hashedpassword3', 'UserThree', NULL);

-- Post 테이블 데이터
INSERT INTO `post` (`post_id`, `member_id`, `title`, `content`, `view_cnt`, `created_at`, `updated_at`, `img`)
VALUES
    (1, 1, 'First Post', 'This is the content of the first post.', 100, '2024-11-01 10:00:00', NULL, 'post1.jpg'),
    (2, 2, 'Second Post', 'This is the content of the second post.', 200, '2024-11-02 11:00:00', NULL, NULL),
    (3, 3, 'Third Post', 'This is the content of the third post.', 300,'2024-11-03 12:00:00', NULL, 'post3.jpg');

-- Comment 테이블 데이터
INSERT INTO `comment` (`comment_id`, `post_id`, `member_id`, `content`, `created_at`, `updated_at`)
VALUES
    (1, 1, 2, 'Great post!', '2024-11-01 12:00:00', NULL),
    (2, 1, 3, 'I found this helpful.', '2024-11-01 13:00:00', NULL),
    (3, 2, 1, 'Nice content!', '2024-11-02 14:00:00', NULL),
    (4, 2, 3, 'Very interesting.', '2024-11-02 15:00:00', NULL),
    (5, 2, 2, 'Well done!', '2024-11-02 16:00:00', NULL),
    (6, 3, 1, 'Thanks for sharing!', '2024-11-03 17:00:00', NULL);

-- Like 테이블 데이터
INSERT INTO `like` (`like_id`, `member_id`, `post_id`)
VALUES
    (1, 1, 2),
    (2, 2, 1),
    (3, 3, 1),
    (4, 1, 3),
    (5, 2, 3),
    (6, 3, 2);