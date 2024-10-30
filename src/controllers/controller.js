import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTest = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
};

export const getSlow = (req, res) => {
    setTimeout(() => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    }, 4000);
};

export const postTest = (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'post ok',
        data: req.body,
    });
};

export const putTest = (req, res) => {
    return res.status(201).json({
        status: 201,
        message: 'put ok',
        data: req.body,
    });
};

export const patchTest = (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'patch ok',
        data: req.body,
    });
};

export const deleteTest = (req, res) => {
    return res.status(204).end();
};

export const dbTest = async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * from Board');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const findNicknamebyUserId = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const user = await req.db.query(
            'SELECT nickname FROM user WHERE user_id = ?;',
            userId,
        );
        if (user.length > 0) {
            res.json({ nickname: user[0][0].nickname });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching nickname:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
