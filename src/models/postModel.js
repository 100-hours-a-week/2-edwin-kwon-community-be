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
    async createPost({ title, content, img }) {
        // 임시로 1번 유저로 생성
        const query = `
      INSERT INTO post (title, content, img, created_at, updated_at, member_id, like_cnt, comment_cnt, view_cnt)
      VALUES (?, ?, ?, NOW(), NOW(), 1, 0, 0, 0)
    `;
        const [result] = await pool.query(query, [title, content, img]);
        return result.insertId; // 생성된 게시물 ID 반환
    },

    // 게시물 업데이트
    async updatePost(postId, { title, content }) {
        const query = `
      UPDATE post 
      SET title = ?, content = ?, updated_at = NOW() 
      WHERE id = ?
    `;
        const [result] = await pool.query(query, [title, content, postId]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    },

    // 게시물 삭제
    async deletePost(postId) {
        const query = `DELETE FROM post WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },

    // 조회수 증가
    async increaseViewCount(postId) {
        const query = `UPDATE post SET view_cnt = view_cnt + 1 WHERE post_id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 증가 성공 여부 반환
    },
};

export default postModel;
