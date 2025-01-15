import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { RegisterUserRequest } from '../../app/dtos/userDtos';
import  container  from '../../infra/di/inversify/inversify.config';


const router = Router();
const userController = container.get<UserController>(UserController);

router.post(
    '/register',
    validationMiddleware(RegisterUserRequest),
    userController.registerUser
);

export default router;
