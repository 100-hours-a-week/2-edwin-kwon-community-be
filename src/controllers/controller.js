import path from 'path';
import { fileURLToPath } from 'url';
import postModel from '../models/postModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSlow = (req, res) => {
    setTimeout(() => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    }, 4000);
};

export const postTest = (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'post ok',
        data: req.body,
    });
};

export const putTest = (req, res) => {
    return res.status(201).json({
        status: 201,
        message: 'put ok',
        data: req.body,
    });
};

export const patchTest = (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'patch ok',
        data: req.body,
    });
};

export const deleteTest = (req, res) => {
    return res.status(204).end();
};

export const findNicknamebyUserId = async (req, res) => {
    const userId = req.params.userid;
    try {
        const userNickname = await req.db.query(
            'SELECT nickname FROM member WHERE member_id = ?;',
            userId,
        );
        if (userNickname.length > 0) {
            await res.json({ nickname: userNickname[0][0].nickname });
        } else {
            await res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching nickname:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const findUserbyUserId = async (req, res) => {
    const userId = req.params.userid;
    try {
        const user = await req.db.query(
            'SELECT * FROM member WHERE member_id = ?;',
            userId,
        );
        if (user.length > 0) {
            res.json(user[0][0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const findPostbyPostId = async (req, res) => {
    const postId = req.params.postid;
    console.log('postId:', postId);
    try {
        const post = await req.db.query(
            'SELECT * FROM post WHERE post_id = ?;',
            postId,
        );
        if (post.length > 0) {
            res.json(post[0][0]);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        console.error('Error fetching Post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
