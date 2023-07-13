import { App } from 'cloud-router';
import bodyParser from './middlewares/bodyParser';
import cookieParser from './middlewares/cookieParser';
import userRouter from './routes/user';
import authenticate from './middlewares/authenticate';
import userAuthorization from './middlewares/userAuthorization';
import imageHandler from './public/image';
import errorHandler from './controllers/errorHandler';
import notFoundHandler from './controllers/404Handler';
import sessionRouter from './routes/session';
import cors from './middlewares/cors';

const app = new App();

app.authenticate(authenticate);
app.public('image', imageHandler);
app.middleware(cors, cookieParser, bodyParser);
app.setRouter('session', sessionRouter);
app.setRouter('user', userRouter, userAuthorization);
app.error(errorHandler);
app.notFound(notFoundHandler);

export default app;
