import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/error-handler';
import users from './users/user.controller';
import { initialize } from './_helpers/db';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', users);

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

// Initialize the database connection before starting the server
initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database connection:', err);
    process.exit(1); // Exit the process if the database connection fails
  });