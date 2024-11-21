import { pool } from '../middleware/dbConnection.js';

// 댓글 모델
const commentModel = {
    // 특정 게시물의 모든 댓글 가져오기
    async getCommentsListByPostId(postId) {
        const query = `
            SELECT 
                c.comment_id,
                c.content,
                c.created_at,
                m.member_id,
                m.nickname,
                m.img
            FROM comment c
            LEFT JOIN member m ON c.member_id = m.member_id
            WHERE c.post_id = ?
            ORDER BY c.created_at;`;
        const [rows] = await pool.query(query, [postId]);
        return rows;
    },

    // 댓글 생성
    async createComment({ postId, content, memberId }) {
        const query = `
            INSERT INTO comment (post_id, content, member_id, created_at) 
            VALUES (?, ?, ?, NOW())
        `;
        const [result] = await pool.query(query, [postId, content, memberId]);
        return result.insertId; // 생성된 댓글 ID 반환
    },

    // 댓글 업데이트
    async updateComment(commentId, { content }) {
        const query = `
            UPDATE comment 
            SET content = ?, updated_at = NOW() 
            WHERE comment_id = ?
        `;
        const [result] = await pool.query(query, [content, commentId]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    },

    // 댓글 삭제
    async deleteComment(commentId) {
        const query = `DELETE FROM comment WHERE comment_id = ?`;
        const [result] = await pool.query(query, [commentId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },
};

export default commentModel;
