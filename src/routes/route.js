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

const router = express.Router();

router.get('/posts', postController.getPostList);
router.post('/posts', postController.createPost);
router.get('/posts/:postid', postController.getPostById);
router.delete('/posts/:postid', postController.deletePost);

router.get('/users', userController.getUserList);
router.get('/users/:userid', userController.getUserById);

router.get('/posts/:postid/comments', commentController.getCommentList);

router.get('/slow', getSlow);
router.post('/test', postTest);
router.put('/test', putTest);
router.patch('/test', patchTest);
router.get('/user-nickname/:userid', findNicknamebyUserId);

export default router;
