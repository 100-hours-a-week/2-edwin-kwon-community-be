import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import testRoutes from './routes/route.js';
import rateLimitMiddleware from './middleware/rateLimitMiddleware.js';
import timeoutMiddleware from './middleware/timeoutMiddleware.js';
import {
    helmetMiddleware,
    cspMiddleware,
} from './middleware/securityMiddleware.js';
import dbConnectionMiddleware from './middleware/dbConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000', // 허용할 도메인 설정 (모든 도메인 허용 시 '*')
    }),
);

// 미들웨어 적용
app.use(helmetMiddleware);
app.use(cspMiddleware);
app.use(rateLimitMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use(timeoutMiddleware);
app.use(dbConnectionMiddleware);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// 라우터 적용
app.use('/api/v1', testRoutes);

app.set('port', process.env.PORT);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

export default app;
