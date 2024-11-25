import PostModel from '../models/postModel.js';

class PostController {
    static async getPostById(req, res) {
        try {
            const postId = req.params.postid;
            const post = await PostModel.getPostById(postId);

            if (post) {
                // 조회수 증가
                await PostModel.increaseViewCount(postId);
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
            const { title, content, img } = req.body;
            const insertId = await PostModel.createPost({
                title,
                content,
                img,
            });
            res.status(201).json({ message: '포스트 생성 성공', id: insertId });
        } catch (error) {
            res.status(500).json({
                error: '포스트 생성 중 오류가 발생했습니다.',
            });
        }
    }

    static async updatePost(req, res) {
        console.log('updatePost');
        try {
            const { title, content, img } = req.body;
            const success = await PostModel.updatePost(req.params.postid, {
                title,
                content,
                img,
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
            const success = await PostModel.deletePost(req.params.postid);

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
        console.log('getPostList');
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
