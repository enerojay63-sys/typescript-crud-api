import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { initialize } from '_helpers/db';
import usersController from 'users/users.controller';
import authController from 'auth/auth.controller';
import adminController from 'admin/admin.controller';
import { errorHandler } from '_middleware/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../src/public')));

// API Routes
app.use('/users', usersController);
app.use('/auth', authController);
app.use('/admin', adminController);

app.use(errorHandler);

initialize()
  .then(() => {
    app.listen(4000, () => {
      console.log('✅ Server running on http://localhost:4000');
    });
  })
  .catch((err: Error) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });