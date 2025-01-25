import { Router } from "express";
import { LoginUserRequest, RegisterUserRequest } from "../../app/dtos/userDtos";
import container from "../../infra/di/inversify/inversify.config";
import { UserController } from "../controllers/userController";
import { validationMiddleware } from "../middleware/validationMiddleware";

const router = Router();
const userController = container.get<UserController>(UserController);

router.post(
	"/register",
	validationMiddleware(RegisterUserRequest),
	userController.registerUser,
);

router.post(
	"/login",
	validationMiddleware(LoginUserRequest),
	userController.loginUser,
);

export default router;
