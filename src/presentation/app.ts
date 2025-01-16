import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { AppDataSource } from '../infra/db/typeOrm/dataSource';

const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use('/api/users', userRoutes);

export default app;
