export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: '인증이 필요합니다.' });
};

export default isAuthenticated;
