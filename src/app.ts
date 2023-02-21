/* npm packages */
import express from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

/* Misc */
import { notFoundResponse } from './helpers/responses';

/* Import Routers */
import staticRouter from './routers/static';

/* Initialize */
dotenv.config();
const app = express();
const { CLIENT_HOME_PAGE_URL } = process.env;
const corsOptions = {
	origin: CLIENT_HOME_PAGE_URL,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
};

/* Middlewares */
app.use(express.json());
// TODO: fix cors allowing every origin
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan('dev'));

/* Routes */
app.use('/', staticRouter);
app.use('*', (req, res) => notFoundResponse(res, 'Endpoint does not exist or has been removed!'));

export default app;
