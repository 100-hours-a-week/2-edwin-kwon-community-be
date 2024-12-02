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
}

export default UserController;
