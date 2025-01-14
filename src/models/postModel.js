import { pool } from '../middleware/dbConnection.js';

// 게시물 모델
const postModel = {
    // 랜딩 페이지 게시글 가져오기 (닉네임, 이미지 포함)
    async getPostList() {
        const query = `
            SELECT 
                p.post_id,
                p.title,
                p.like_cnt,
                p.comment_cnt,
                p.view_cnt,
                p.created_at,
                p.updated_at,
                m.member_id,
                m.nickname,
                m.img
            FROM post p
            LEFT JOIN member m ON p.member_id = m.member_id
            ORDER BY p.post_id;`;
        const [rows] = await pool.query(query);
        return rows;
    },
    // 모든 게시물 가져오기
    async getAllPosts() {
        const query = `SELECT * FROM post ORDER BY created_at DESC`;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 특정 ID의 게시물 가져오기
    async getPostById(postId) {
        const query = `SELECT * FROM post WHERE post_id = ?`;
        const [rows] = await pool.query(query, [postId]);
        return rows[0]; // 단일 게시물 반환
    },

    // 게시물 생성
    async createPost(userId, title, content, img) {
        const query = `
      INSERT INTO post (title, content, img, created_at, updated_at, member_id, like_cnt, comment_cnt, view_cnt)
      VALUES (?, ?, ?, NOW(), NOW(), ?, 0, 0, 0)
    `;
        const [result] = await pool.query(query, [title, content, img, userId]);
        return result.insertId; // 생성된 게시물 ID 반환
    },

    // 게시물 업데이트
    async updatePost(userId, postId, title, content, img) {
        const query = `
      UPDATE post 
      SET title = ?, content = ?, img = ?, updated_at = NOW() 
      WHERE post_id = ? AND member_id = ?
    `;
        const [result] = await pool.query(query, [
            title,
            content,
            img,
            postId,
            userId,
        ]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    },

    // 게시물 삭제
    async deletePost(userId, postId) {
        const query = `DELETE FROM post WHERE post_id = ? AND member_id = ?`;
        const [result] = await pool.query(query, [postId, userId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },

    // 조회수 증가
    async increaseViewCount(postId) {
        const query = `UPDATE post SET view_cnt = view_cnt + 1 WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 증가 성공 여부 반환
    },

    // 댓글 수 증가
    async increaseCommentCount(postId) {
        const query = `UPDATE post SET comment_cnt = comment_cnt + 1 WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 증가 성공 여부 반환
    },

    // 댓글 수 감소
    async decreaseCommentCount(postId) {
        const query = `UPDATE post SET comment_cnt = comment_cnt - 1 WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 감소 성공 여부 반환
    },

    // 좋아요 수 증가
    async increaseLikeCount(postId) {
        const query = `UPDATE post SET like_cnt = like_cnt + 1 WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 증가 성공 여부 반환
    },

    // 좋아요 수 감소
    async decreaseLikeCount(postId) {
        const query = `UPDATE post SET like_cnt = like_cnt - 1 WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 감소 성공 여부 반환
    },
};

export default postModel;
