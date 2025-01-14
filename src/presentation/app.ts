import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes); 
app.use(errorMiddleware);           

export default app;