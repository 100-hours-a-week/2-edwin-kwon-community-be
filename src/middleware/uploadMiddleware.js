import multer from 'multer';
import path from 'path';

// 프로필 이미지용 저장소 설정
const profileStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/profiles/'); // 프로필 이미지 저장 경로
    },
    filename(req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    },
});

// 게시글 이미지용 저장소 설정
const postStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/posts/'); // 게시글 이미지 저장 경로
    },
    filename(req, file, cb) {
        cb(null, 'post-' + Date.now() + path.extname(file.originalname));
    },
});

// 파일 필터링 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    // 허용할 파일 형식 정의
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 허용
    } else {
        cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
};

// 프로필 이미지 업로드 설정
const uploadProfile = multer({
    storage: profileStorage,
    fileFilter,
    limits: {
        fileSize: 150 * 1024 * 1024,
        files: 1,
    },
}).single('img');

// 게시글 이미지 업로드 설정
const uploadPost = multer({
    storage: postStorage,
    fileFilter,
    limits: {
        fileSize: 150 * 1024 * 1024,
        files: 1,
    },
}).single('img');

export { uploadProfile, uploadPost };
