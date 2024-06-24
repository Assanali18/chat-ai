import { Router } from 'express';
import { chatRouter } from './chat/chat.router';
// other routers can be imported here

const globalRouter = Router();

// Use the userRouter for user-related routes
globalRouter.use(chatRouter);

// other routers can be added here

export default globalRouter;
