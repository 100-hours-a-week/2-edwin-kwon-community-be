import postModel from '../models/postModel.js';

export const getPostById = async (req, res) => {
    try {
        const post = await postModel.getPostById(req.db);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        const insertId = await postModel.createPost({
            title,
            content,
            authorId,
        });
        res.status(201).json({ id: insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const success = await postModel.updatePost(req.params.id, {
            title,
            content,
        });
        if (success) {
            res.json({ message: 'Post updated successfully' });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const success = await postModel.deletePost(req.params.id);
        if (success) {
            res.json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostList = async (req, res) => {
    try {
        const postList = await postModel.getPostList();
        res.json(postList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
