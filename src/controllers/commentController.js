import CommentModel from '../models/commentModel.js';
import PostModel from '../models/postModel.js';

const CommentController = {
    async getCommentById(req, res) {
        try {
            const commentId = req.params.commentid;
            const comment = await CommentModel.getCommentById(commentId);

            if (comment) {
                res.json(comment);
            } else {
                res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createComment(req, res) {
        try {
            const userId = req.session.userId;
            const postId = req.params.postid;
            const { content } = req.body;
            const insertId = await CommentModel.createComment(userId, postId, {
                content,
            });
            await PostModel.increaseCommentCount(postId);
            res.status(201).json({ message: '댓글 생성 성공', id: insertId });
        } catch (error) {
            res.status(500).json({
                error: '댓글 생성 중 오류가 발생했습니다.',
            });
        }
    },

    async updateComment(req, res) {
        try {
            const userId = req.session.userId;
            const { content } = req.body;
            const success = await CommentModel.updateComment(
                userId,
                req.params.commentid,
                {
                    content,
                },
            );
            if (success) {
                res.json({
                    message: '댓글이 성공적으로 업데이트되었습니다.',
                });
            } else {
                res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '댓글 업데이트 중 오류가 발생했습니다.',
            });
        }
    },

    async deleteComment(req, res) {
        try {
            const userId = req.session.userId;
            const success = await CommentModel.deleteComment(
                userId,
                req.params.commentid,
            );

            if (success) {
                await PostModel.decreaseCommentCount(req.params.postid);
                res.json({ message: '댓글이 성공적으로 삭제되었습니다.' });
            } else {
                res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '댓글 삭제 중 오류가 발생했습니다.',
            });
        }
    },

    async getCommentList(req, res) {
        try {
            const postId = req.params.postid;
            const commentList =
                await CommentModel.getCommentsListByPostId(postId);
            res.json(commentList);
        } catch (error) {
            res.status(500).json({
                error: '댓글 목록을 가져오는 중 오류가 발생했습니다.',
            });
        }
    },
};

export default CommentController;
