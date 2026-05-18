import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './_middleware/error-handler';
import { initialize } from './_helpers/db';
import userController from './users/users.controller';
import swaggerRouter from './_helpers/swagger';
import accountsController from './accounts/account.controller';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:4200', 'https://enero-frontend-smel.onrender.com'],
    credentials: true
}));
app.use(cookieParser());
// Start database initialization immediately
const initPromise = initialize();

initPromise.catch((err) => {
    console.error('Failed to initialize database:', err);
    if (!process.env.VERCEL) {
        process.exit(1);
    }
});

// Middleware to ensure database is initialized before handling requests
app.use(async (req, res, next) => {
    try {
        await initPromise;
        next();
    } catch (err) {
        next(err);
    }
});

app.use('/accounts', accountsController);
app.use('/api-docs', swaggerRouter);
app.use('/users', userController);

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
    });
}

export default app;