import { Router } from "express";
import {
	DeleteUserRequest,
	LoginUserRequest,
	RegisterUserRequest,
} from "../../app/dtos/userDtos";
import container from "../../infra/di/inversify/inversify.config";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
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

router.get("/fetchAll", authMiddleware, userController.getAllUsers);

router.post(
	"/delete",
	validationMiddleware(DeleteUserRequest),
	authMiddleware,
	userController.deleteUser,
);

export default router;
