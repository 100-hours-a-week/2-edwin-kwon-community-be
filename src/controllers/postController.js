import PostModel from '../models/postModel.js';

class PostController {
    static async getPostById(req, res) {
        try {
            const postId = req.params.id;
            const post = await PostModel.getPostById(postId);

            if (post) {
                res.json(post);
            } else {
                res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createPost(req, res) {
        try {
            const { title, content, authorId } = req.body;
            const insertId = await PostModel.create({
                title,
                content,
                authorId,
            });

            res.status(201).json({ message: '포스트 생성 성공', id: insertId });
        } catch (error) {
            res.status(500).json({
                error: '포스트 생성 중 오류가 발생했습니다.',
            });
        }
    }

    static async updatePost(req, res) {
        try {
            const { title, content } = req.body;
            const success = await PostModel.update(req.params.id, {
                title,
                content,
            });

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
    }

    static async deletePost(req, res) {
        try {
            const success = await PostModel.delete(req.params.id);

            if (success) {
                res.json({ message: '포스트가 성공적으로 삭제되었습니다.' });
            } else {
                res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '포스트 삭제 중 오류가 발생했습니다.',
            });
        }
    }

    static async getPostList(req, res) {
        try {
            const postList = await PostModel.getPostList();
            res.json(postList);
        } catch (error) {
            res.status(500).json({
                error: '포스트 목록을 가져오는 중 오류가 발생했습니다.',
            });
        }
    }
}

export default PostController;
