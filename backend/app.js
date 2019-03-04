import express, { json, urlencoded, static } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Client } from 'pg';

import indexRouter from './routes/index';
import apiRouter from './routes/api';

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static(join(__dirname, 'public')));

app.use('/', indexRouter);

const client = new Client();
await client.connect(process.env.DATABASE_URL);

app.use('/api', apiRouter(client));

export default app;
