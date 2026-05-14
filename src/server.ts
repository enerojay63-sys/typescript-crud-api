import 'module-alias/register';
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
app.use(cors());
app.use(cookieParser());

app.use('/accounts', accountsController);
app.use('/api-docs', swaggerRouter);
app.use('/users', userController);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
        });
    }).catch((err) => {
        console.log('Failed to initialize database::', err);
        process.exit(1);
    });