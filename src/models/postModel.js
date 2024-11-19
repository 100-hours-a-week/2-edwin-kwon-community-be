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
        const query = `SELECT * FROM posts ORDER BY created_at DESC`;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 특정 ID의 게시물 가져오기
    async getPostById(postId) {
        const query = `SELECT * FROM posts WHERE id = ?`;
        const [rows] = await pool.query(query, [postId]);
        return rows[0]; // 단일 게시물 반환
    },

    // 게시물 생성
    async createPost({ title, content, authorId }) {
        const query = `
      INSERT INTO posts (title, content, author_id, created_at) 
      VALUES (?, ?, ?, NOW())
    `;
        const [result] = await pool.query(query, [title, content, authorId]);
        return result.insertId; // 생성된 게시물 ID 반환
    },

    // 게시물 업데이트
    async updatePost(postId, { title, content }) {
        const query = `
      UPDATE posts 
      SET title = ?, content = ?, updated_at = NOW() 
      WHERE id = ?
    `;
        const [result] = await pool.query(query, [title, content, postId]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    },

    // 게시물 삭제
    async deletePost(postId) {
        const query = `DELETE FROM posts WHERE id = ?`;
        const [result] = await pool.query(query, [postId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },
};

export default postModel;
