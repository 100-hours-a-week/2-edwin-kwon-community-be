import UserModel from '../models/userModel.js';
import fs from 'fs';
import path from 'path';

class UserController {
    static async getUserById(req, res) {
        try {
            const userId = req.params.userId;
            console.log('userId', userId);
            const user = await UserModel.getUserById(userId);

            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createUser(req, res) {
        try {
            const imgPath = req.file
                ? `/uploads/profiles/${req.file.filename}`
                : null;
            const { email, password, nickname } = req.body;

            console.log('email:', email);
            console.log('password:', password);
            console.log('nickname:', nickname);

            const insertId = await UserModel.createUser({
                email,
                password,
                nickname,
                imgPath,
            });

            res.status(201).json({ message: 'ok', id: insertId });
        } catch (error) {
            console.error('User creation error:', error);
            res.status(500).json({
                error: '사용자 생성 중 오류가 발생했습니다.',
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const updates = {};

            // 닉네임 업데이트가 있는 경우
            if (req.body.nickname) {
                updates.nickname = req.body.nickname;
            }

            // 이미지 업데이트가 있는 경우
            if (req.file) {
                updates.img = `/uploads/profiles/${req.file.filename}`;
            }

            // 세션에서 userId 가져오기
            const userId = req.session.userId;

            const success = await UserModel.updateUser(userId, {
                ...updates,
            });

            if (success) {
                return res.json({
                    message: 'ok',
                });
            }
            return res
                .status(404)
                .json({ error: '사용자를 찾을 수 없습니다.' });
        } catch (error) {
            return res.status(500).json({
                error: '사용자 정보 업데이트 중 오류가 발생했습니다.',
            });
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.session.userId;

            // 사용자 정보를 먼저 가져와서 이미지 경로 확인
            const user = await UserModel.getUserById(userId);

            // 이미지 파일 삭제 처리
            if (user && user.img) {
                const imagePath = path.join(process.cwd(), 'public', user.img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            const success = await UserModel.deleteUser(userId);
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({
                        error: '로그아웃 처리 중 오류가 발생했습니다.',
                    });
                }
            });
            res.clearCookie('sessionId');

            // 게시글 댓글 회원 탈퇴로 변경
            await req.db.query(
                'UPDATE post SET member_id = 1 WHERE member_id = ?;',
                userId,
            );
            await req.db.query(
                'UPDATE comment SET member_id = 1 WHERE member_id = ?;',
                userId,
            );

            if (success) {
                res.json({ message: 'ok' });
            } else {
                res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '사용자 삭제 중 오류가 발생했습니다.',
            });
        }
    }

    static async checkNickname(req, res) {
        const { nickname } = req.query;
        const isDuplicate = await UserModel.checkNickname(nickname);
        if (isDuplicate) {
            res.status(400).json({ error: '이미 사용 중인 닉네임입니다.' });
        } else {
            res.json({ message: 'ok' });
        }
    }

    static async checkEmail(req, res) {
        const { email } = req.query;
        const isDuplicate = await UserModel.checkEmail(email);
        if (isDuplicate) {
            res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
        } else {
            res.json({ message: 'ok' });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        const user = await UserModel.login(email, password);

        if (user) {
            // 세션에는 사용자 식별자만 저장
            req.session.userId = user.member_id;

            // 세션 생성 확인을 위한 로깅
            console.log('세션 ID:', req.sessionID);
            console.log('세션 데이터:', req.session);

            res.json({ message: 'ok' });
        } else {
            res.status(401).json({
                error: '이메일 또는 비밀번호가 일치하지 않습니다.',
            });
        }
    }

    // 로그아웃 메서드 추가
    static async logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: '로그아웃 처리 중 오류가 발생했습니다.' });
            }
            res.clearCookie('sessionId');
            res.json({ message: 'ok' });
        });
    }

    static async getProfileImg(req, res) {
        try {
            const userId = req.session.userId;

            const img = await UserModel.getImgByUserId(userId);
            if (img) return res.json(img);
            return res.status(404).json({
                error: '프로필 이미지를 찾을 수 없습니다.',
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getProfile(req, res) {
        try {
            const userId = req.session.userId;
            const user = await UserModel.getUserById(userId);

            if (user) return res.json(user);
            return res.status(404).json({
                error: '사용자를 찾을 수 없습니다.',
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async updatePassword(req, res) {
        try {
            const userId = req.session.userId;
            const { password } = req.body;

            const success = await UserModel.updatePassword(userId, password);
            if (success) {
                res.json({ message: 'ok' });
            } else {
                res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '사용자 정보 업데이트 중 오류가 발생했습니다.',
            });
        }
    }
}

export default UserController;
