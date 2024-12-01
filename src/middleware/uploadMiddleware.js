import multer from 'multer';
import path from 'path';

// 파일 저장소 설정
const storage = multer.diskStorage({
    // 저장될 경로 설정
    destination(req, file, cb) {
        cb(null, 'public/uploads/'); // 'uploads' 폴더에 파일 저장
    },
    // 저장될 파일명 설정
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname),
        );
    },
});

// 파일 필터링 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    // 허용할 파일 형식 정의
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 허용
    } else {
        cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
};

// 업로드 설정
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
}).single('profileImage');

export default upload;
