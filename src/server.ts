import express, { Application } from 'express';
import cors from 'cors';
import { initialize } from '_helpers/db';
import usersController from 'users/users.controller';
import { errorHandler } from '_middleware/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersController);
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