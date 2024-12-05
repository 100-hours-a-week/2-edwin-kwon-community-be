import UserModel from '../models/userModel.js';

class UserController {
    static async getUserById(req, res) {
        try {
            const userId = req.params.userid;
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

            const insertId = await UserModel.createUser({
                email,
                password,
                nickname,
                imgPath,
            });

            res.status(201).json({ message: '사용자 생성 성공', id: insertId });
        } catch (error) {
            console.error('User creation error:', error);
            res.status(500).json({
                error: '사용자 생성 중 오류가 발생했습니다.',
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const { username, email } = req.body;
            const success = await UserModel.update(req.params.id, {
                username,
                email,
            });

            if (success) {
                res.json({
                    message: '사용자 정보가 성공적으로 업데이트되었습니다.',
                });
            } else {
                res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '사용자 정보 업데이트 중 오류가 발생했습니다.',
            });
        }
    }

    static async deleteUser(req, res) {
        try {
            const success = await UserModel.delete(req.params.id);

            if (success) {
                res.json({ message: '사용자가 성공적으로 삭제되었습니다.' });
            } else {
                res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            }
        } catch (error) {
            res.status(500).json({
                error: '사용자 삭제 중 오류가 발생했습니다.',
            });
        }
    }

    static async getUserList(req, res) {
        try {
            const userList = await UserModel.getUserList();
            res.json(userList);
        } catch (error) {
            res.status(500).json({
                error: '사용자 목록을 가져오는 중 오류가 발생했습니다.',
            });
        }
    }

    static async checkNickname(req, res) {
        const { nickname } = req.query;
        const isDuplicate = await UserModel.checkNickname(nickname);
        if (isDuplicate) {
            res.status(400).json({ error: '이미 사용 중인 닉네임입니다.' });
        } else {
            res.json({ message: '사용 가능한 닉네임입니다.' });
        }
    }

    static async checkEmail(req, res) {
        const { email } = req.query;
        const isDuplicate = await UserModel.checkEmail(email);
        if (isDuplicate) {
            res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
        } else {
            res.json({ message: '사용 가능한 이메일입니다.' });
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

            res.json({ message: '로그인 성공' });
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
            res.json({ message: '로그아웃 성공' });
        });
    }

    static async getProfileImg(req, res) {
        try {
            // 인증 상태 확인
            if (!req.session || !req.session.userId) {
                return res.status(401).json({ error: '로그인이 필요합니다.' });
            }
            // 세션에서 userId 가져오기
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
        console.log('getProfile');
        try {
            // 인증 상태 확인
            if (!req.session || !req.session.userId) {
                return res.status(401).json({ error: '로그인이 필요합니다.' });
            }

            // 세션에서 userId 가져오기
            const userId = req.session.userId;

            console.log(userId);

            const user = await UserModel.getUserById(userId);
            if (user) return res.json(user);
            return res.status(404).json({
                error: '사용자를 찾을 수 없습니다.',
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default UserController;
