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
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
// post
router.get('/posts', postController.getPostList);
router.post('/posts', upload, postController.createPost);
router.get('/posts/:postid', postController.getPostById);
router.delete('/posts/:postid', postController.deletePost);
router.put('/posts/:postid', postController.updatePost);
router.get('/posts/:postid/like', postController.getLike);
router.post('/posts/:postid/like', postController.likePost);
router.delete('/posts/:postid/like', postController.unlikePost);

// user, auth
router.get('/users', userController.getUserList);
router.get('/users/:userid', userController.getUserById);
router.post('/auth/signup', upload, userController.createUser);
router.get('/auth/check-nickname', userController.checkNickname);
router.get('/auth/check-email', userController.checkEmail);
// router.post('/auth/login', userController.login);
// router.post('/auth/logout', userController.logout);

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

router.get('/slow', getSlow);
router.post('/test', postTest);
router.put('/test', putTest);
router.patch('/test', patchTest);
router.get('/user-nickname/:userid', findNicknamebyUserId);

export default router;
