import express from 'express';

import postController from '../controllers/postController.js';
import userController from '../controllers/userController.js';
import commentController from '../controllers/commentController.js';

// middleware
import { uploadProfile, uploadPost } from '../middleware/uploadMiddleware.js';
import isAuthenticated from '../middleware/auth.js';
import isValidPassword from '../middleware/passwordPolicy.js';

const router = express.Router();

// user, auth
router.get('/users/profile', isAuthenticated, userController.getProfile);
router.get('/users/:userId', userController.getUserById);
router.get('/auth/check-nickname', userController.checkNickname);
router.get('/auth/check-email', userController.checkEmail);
router.post(
    '/auth/signup',
    uploadProfile,
    isValidPassword,
    userController.createUser,
);
router.post('/auth/login', isValidPassword, userController.login);
router.get('/auth/img', isAuthenticated, userController.getProfileImg);
router.post('/auth/logout', isAuthenticated, userController.logout);
router.post(
    '/auth/presigned-url/profile',
    userController.getPresignedUrlProfile,
);
router.put(
    '/users/password',
    isAuthenticated,
    isValidPassword,
    userController.updatePassword,
);
router.delete('/users', isAuthenticated, userController.deleteUser);
router.put('/users', isAuthenticated, uploadProfile, userController.updateUser);

// post
router.get('/posts', postController.getPostList);
router.post('/posts', isAuthenticated, uploadPost, postController.createPost);
router.get('/posts/:postid', postController.getPostById);
router.delete('/posts/:postid', isAuthenticated, postController.deletePost);
router.put(
    '/posts/:postid',
    isAuthenticated,
    uploadPost,
    postController.updatePost,
);
router.get('/posts/:postid/like', postController.getLike);
router.post('/posts/:postid/like', isAuthenticated, postController.likePost);
router.delete(
    '/posts/:postid/like',
    isAuthenticated,
    postController.unlikePost,
);
router.post(
    '/auth/presigned-url/post',
    isAuthenticated,
    postController.getPresignedUrlPost,
);

// comment
router.get('/posts/:postid/comments', commentController.getCommentList);
router.post(
    '/posts/:postid/comments',
    isAuthenticated,
    commentController.createComment,
);
router.put(
    '/posts/:postid/comments/:commentid',
    isAuthenticated,
    commentController.updateComment,
);
router.delete(
    '/posts/:postid/comments/:commentid',
    isAuthenticated,
    commentController.deleteComment,
);

export default router;
