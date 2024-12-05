import express from 'express';
import {
    getSlow,
    postTest,
    putTest,
    patchTest,
    findNicknamebyUserId,
} from '../controllers/controller.js';
import postController from '../controllers/postController.js';
import userController from '../controllers/userController.js';
import commentController from '../controllers/commentController.js';
import { uploadProfile, uploadPost } from '../middleware/uploadMiddleware.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();
// post
router.get('/posts', postController.getPostList);
router.post('/posts', isAuthenticated, uploadPost, postController.createPost);
router.get('/posts/:postid', postController.getPostById);
router.delete('/posts/:postid', isAuthenticated, postController.deletePost);
router.put('/posts/:postid', isAuthenticated, postController.updatePost);
router.get('/posts/:postid/like', postController.getLike);
router.post('/posts/:postid/like', isAuthenticated, postController.likePost);
router.delete(
    '/posts/:postid/like',
    isAuthenticated,
    postController.unlikePost,
);

// user, auth
router.get('/users', userController.getUserList);
router.get('/users/:usierid', userController.getUserById);
router.get('/users/profile', isAuthenticated, userController.getProfile);
router.post('/auth/signup', uploadProfile, userController.createUser);
router.get('/auth/check-nickname', userController.checkNickname);
router.get('/auth/check-email', userController.checkEmail);
router.post('/auth/login', userController.login);
router.get('/auth/img', isAuthenticated, userController.getProfileImg);
router.post('/auth/logout', isAuthenticated, userController.logout);

// comment
router.get('/posts/:postid/comments', commentController.getCommentList);
router.post('/posts/:postid/comments', commentController.createComment);
router.put(
    '/posts/:postid/comments/:commentid',
    commentController.updateComment,
);
router.delete(
    '/posts/:postid/comments/:commentid',
    commentController.deleteComment,
);

// test
router.get('/slow', getSlow);
router.post('/test', postTest);
router.put('/test', putTest);
router.patch('/test', patchTest);
router.get('/user-nickname/:userid', findNicknamebyUserId);

export default router;
