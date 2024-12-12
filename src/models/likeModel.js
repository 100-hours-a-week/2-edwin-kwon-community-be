import { pool } from '../middleware/dbConnection.js';

// 좋아요 모델
const likeModel = {
    // 좋아요 생성
    async createLike(userId, postId) {
        const query = `
            INSERT INTO \`like\` (post_id, member_id) 
            VALUES (?, ?)
        `;
        const [result] = await pool.query(query, [postId, userId]);
        return result.insertId; // 생성된 댓글 ID 반환
    },

    // 좋아요 조회
    async getLike(postId) {
        const query = `SELECT * FROM \`like\` WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result;
    },

    // 좋아요 삭제
    async deleteLike(userId, postId) {
        const query = `DELETE FROM \`like\` WHERE post_id = ? AND member_id = ?`;
        const [result] = await pool.query(query, [postId, userId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },
};

export default likeModel;
