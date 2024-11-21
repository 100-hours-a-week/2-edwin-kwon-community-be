import express from 'express';
import {
    getSlow,
    postTest,
    putTest,
    patchTest,
    deleteTest,
    findNicknamebyUserId,
    findUserbyUserId,
    findPostbyPostId,
} from '../controllers/controller.js';
import postController from '../controllers/postController.js';

const router = express.Router();

router.get('/slow', getSlow);
router.post('/test', postTest);
router.put('/test', putTest);
router.patch('/test', patchTest);
router.delete('/test', deleteTest);
router.get('/posts', postController.getPostList);
router.get('/user-nickname/:userid', findNicknamebyUserId);
router.get('/users/:userid', findUserbyUserId);
router.get('/post/:postid', findPostbyPostId);

export default router;
