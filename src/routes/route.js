import express from 'express';
import {
    getSlow,
    postTest,
    putTest,
    patchTest,
    deleteTest,
    dbTest,
    findNicknamebyUserId,
    findUserbyUserId,
    findPostbyPostId,
} from '../controllers/controller.js';

const router = express.Router();
const apiPrefix = '/api/v1';

router.get('/slow', getSlow);
router.post('/test', postTest);
router.put('/test', putTest);
router.patch('/test', patchTest);
router.delete('/test', deleteTest);
router.get('/dbtest', dbTest);
router.get('/user-nickname/:userid', findNicknamebyUserId);
router.get('/users/:userid', findUserbyUserId);
router.get('/post/:postid', findPostbyPostId);

export default router;
