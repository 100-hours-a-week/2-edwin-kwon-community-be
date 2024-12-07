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
            const { username, email, password, nickname } = req.body;
            const insertId = await UserModel.create({
                username,
                email,
                password,
                nickname,
            });

            res.status(201).json({ message: '사용자 생성 성공', id: insertId });
        } catch (error) {
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
}

export default UserController;
