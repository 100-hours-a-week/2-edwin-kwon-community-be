import PostModel from '../models/postModel.js';
import LikeModel from '../models/likeModel.js';
import path from 'path';
import fs from 'fs';
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

// AWS S3 설정
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const PostController = {
    async getPostById(req, res) {
        try {
            const postId = req.params.postid;
            let post = await PostModel.getPostById(postId);

            if (post) {
                // 조회수 증가
                await PostModel.increaseViewCount(postId);
                post = await PostModel.getPostById(postId);
                res.json(post);
            } else {
                res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createPost(req, res) {
        try {
            const memberId = req.session.userId;
            const { title, content } = req.body;

            const img = req.body.imgUrl ? req.body.imgUrl : null;
            const insertId = await PostModel.createPost(
                memberId,
                title,
                content,
                img,
            );
            res.status(201).json({ message: '포스트 생성 성공', id: insertId });
        } catch (error) {
            res.status(500).json({
                error: '포스트 생성 중 오류가 발생했습니다.',
            });
        }
    },

    async likePost(req, res) {
        try {
            await LikeModel.createLike(req.session.userId, req.params.postid);

            const like = await LikeModel.getLike(req.params.postid);
            const likeCnt = like.length;
            await PostModel.increaseLikeCount(req.params.postid);
            res.status(201).json({
                message: 'ok',
                likeCnt,
            });
        } catch (error) {
            res.status(500).json({
                error: '좋아요 생성 중 오류가 발생했습니다.',
            });
        }
    },

    async unlikePost(req, res) {
        try {
            await LikeModel.deleteLike(req.session.userId, req.params.postid);
            const like = await LikeModel.getLike(req.params.postid);
            const likeCnt = like.length;
            await PostModel.decreaseLikeCount(req.params.postid);
            res.status(201).json({
                message: 'ok',
                likeCnt,
            });
        } catch (error) {
            res.status(500).json({
                error: '좋아요 삭제 중 오류가 발생했습니다.',
            });
        }
    },

    async getLike(req, res) {
        try {
            const like = await LikeModel.getLike(req.params.postid);
            res.status(201).json({
                message: 'ok',
                data: like,
            });
        } catch (error) {
            res.status(500).json({
                error: '좋아요 조회 중 오류가 발생했습니다.',
            });
        }
    },

    async updatePost(req, res) {
        try {
            const { title, content } = req.body;
            const img = req.body.imgUrl ? req.body.imgUrl : null;

            const success = await PostModel.updatePost(
                req.session.userId,
                req.params.postid,
                title,
                content,
                img,
            );

            if (success) {
                res.json({
                    message: '포스트가 성공적으로 업데이트되었습니다.',
                });
            } else {
                res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '포스트 업데이트 중 오류가 발생했습니다.',
            });
        }
    },

    async deletePost(req, res) {
        try {
            const post = await PostModel.getPostById(req.params.postid);
            if (post && post.img) {
                const imagePath = path.join(process.cwd(), 'public', post.img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await PostModel.deletePost(req.session.userId, req.params.postid);
            res.json({ message: '포스트가 성공적으로 삭제되었습니다.' });
        } catch (error) {
            res.status(500).json({
                error: '포스트 삭제 중 오류가 발생했습니다.',
            });
        }
    },

    async getPostList(req, res) {
        try {
            const postList = await PostModel.getPostList();
            res.json(postList);
        } catch (error) {
            res.status(500).json({
                error: '포스트 목록을 가져오는 중 오류가 발생했습니다.',
            });
        }
    },

    async getPresignedUrlPost(req, res) {
        try {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `posts/${Date.now()}.${req.body.fileType.split('/')[1]}`,
                ContentType: req.body.fileType,
            };

            const command = new PutObjectCommand(params);
            const presignedUrl = await getSignedUrl(s3, command, {
                expiresIn: 60,
            });

            const cloudFrontUrl = `${process.env.CLOUDFRONT_DOMAIN}/${params.Key}`;
            res.json({ presignedUrl, cloudFrontUrl });
        } catch (error) {
            res.status(500).json({
                error: error.message,
            });
        }
    },
};

export default PostController;
