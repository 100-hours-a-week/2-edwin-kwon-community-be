import { pool } from '../middleware/dbConnection.js';

// 유저 모델 객체
const userModel = {
    // 모든 유저 가져오기
    async getAllUsers() {
        const query = `SELECT * FROM users ORDER BY created_at DESC`;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 특정 ID의 유저 가져오기
    async getUserById(userId) {
        const query = `SELECT * FROM member WHERE member_id = ?`;
        const [rows] = await pool.query(query, [userId]);
        return rows[0]; // 단일 유저 반환
    },

    // 유저 생성
    async createUser({ email, password, nickname, imgPath }) {
        const query = `
            INSERT INTO member (email, password, nickname, img, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        `;
        const [result] = await pool.query(query, [
            email,
            password,
            nickname,
            imgPath,
        ]);
        return result.insertId; // 생성된 유저 ID 반환
    },

    // 유저 업데이트
    async updateUser(userId, updates) {
        // 업데이트할 필드와 값을 동적으로 생성
        const setClause = [];
        const values = [];

        Object.entries(updates).forEach(([key, value]) => {
            setClause.push(`${key} = ?`);
            values.push(value);
        });

        // updated_at은 항상 업데이트
        //setClause.push('updated_at = NOW()');

        // userId를 values 배열의 마지막에 추가
        values.push(userId);

        const query = `
            UPDATE member 
            SET ${setClause.join(', ')}
            WHERE member_id = ?
        `;

        console.log(query, values);

        const [result] = await pool.query(query, values);
        return result.affectedRows > 0;
    },

    // 유저 삭제
    async deleteUser(userId) {
        const query = `DELETE FROM member WHERE member_id = ?`;
        const [result] = await pool.query(query, [userId]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    },

    // 닉네임 중복 체크
    async checkNickname(nickname) {
        const query = `SELECT * FROM member WHERE nickname = ?`;
        const [result] = await pool.query(query, [nickname]);
        return result.length > 0; // 중복 여부 반환
    },

    async checkEmail(email) {
        const query = `SELECT * FROM member WHERE email = ?`;
        const [result] = await pool.query(query, [email]);
        return result.length > 0; // 중복 여부 반환
    },

    // 로그인
    async login(email, password) {
        const query = `SELECT * FROM member WHERE email = ? AND password = ?`;
        const [result] = await pool.query(query, [email, password]);
        return result[0]; // 단일 유저 반환
    },

    async getImgByUserId(userId) {
        const query = `SELECT img FROM member WHERE member_id = ?`;
        const [result] = await pool.query(query, [userId]);
        return result[0]; // 단일 유저(Return)
    },

    async updatePassword(userId, password) {
        const query = `UPDATE member SET password = ? WHERE member_id = ?`;
        const [result] = await pool.query(query, [password, userId]);
        return result.affectedRows > 0;
    },
};

export default userModel;
