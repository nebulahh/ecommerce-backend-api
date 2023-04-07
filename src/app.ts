import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import * as middlewares from './middleware/middlewares';
import api from './routes';
import connectDB  from './config/db';

require('dotenv').config();

const app = express();

connectDB();

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
