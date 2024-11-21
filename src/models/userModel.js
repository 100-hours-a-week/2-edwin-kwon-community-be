import { pool } from '../middleware/dbConnection.js';

// 유저 모델 객체
const userModel = {
    // 유저 목록 가져오기 (닉네임, 이메일 포함)
    async getUserList() {
        const query = `
            SELECT 
                u.user_id,
                u.username,
                u.email,
                u.created_at,
                u.updated_at
            FROM users u
            ORDER BY u.user_id;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 모든 유저 가져오기
    async getAllUsers() {
        const query = `SELECT * FROM users ORDER BY created_at DESC`;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 특정 ID의 유저 가져오기
    async getUserById(userId) {
        console.log('getUserById ' + userId);
        const query = `SELECT * FROM member WHERE member_id = ?`;
        const [rows] = await pool.query(query, [userId]);
        return rows[0]; // 단일 유저 반환
    },

    // 유저 생성
    async createUser({ username, email, password }) {
        const query = `
            INSERT INTO users (username, email, password, created_at) 
            VALUES (?, ?, ?, NOW())
        `;
        const [result] = await pool.query(query, [username, email, password]);
        return result.insertId; // 생성된 유저 ID 반환
    },

    // 유저 업데이트
    async updateUser(userId, { username, email, password }) {
        const query = `
            UPDATE users 
            SET username = ?, email = ?, password = ?, updated_at = NOW() 
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [
            username,
            email,
            password,
            userId,
        ]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    },

    // 유저 삭제
    async deleteUser(userId) {
        const query = `DELETE FROM users WHERE id = ?`;
        const [result] = await pool.query(query, [userId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },
};

export default userModel;
