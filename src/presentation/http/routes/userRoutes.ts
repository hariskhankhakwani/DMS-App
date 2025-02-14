import { implement } from "@orpc/server";
import { Router } from "express";
import container from "../../../infra/di/inversify/inversify.config";
import { userContract } from "../contracts/userContract";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

const userController = container.get<UserController>(UserController);

const pub = implement(userContract);

export const userRouter = pub.router({
	register: pub.register.handler(async ({ input, context }) => {
		const result = await userController.registerUser(input);
		return {
			message: result.message,
			data: result.data,
		};
	}),

	login: pub.login.handler(async ({ input, context }) => {
		const result = await userController.loginUser(input);
		return {
			message: result.message,
			data: result.data,
		};
	}),

	// getAllUsers: authed.getAllUsers.handler(async ({ input, context }) => {
	// 	const result = await userController.getAllUsers(context.req, context.res);
	// 	return {
	// 		message: "Users retrieved successfully",
	// 		data: result.data
	// 	};
	// }),

	// deleteUser: authed.deleteUser.handler(async ({ input, context }) => {
	// 	const result = await userController.deleteUser(context.req, context.res);
	// 	return {
	// 		message: "User deleted successfully",
	// 		data: result.data
	// 	};
	// }),

	// updateRole: authed.updateRole.handler(async ({ input, context }) => {
	// 	const result = await userController.updateUserRole(context.req, context.res);
	// 	return {
	// 		message: "Role updated successfully",
	// 		data: result.data
	// 	};
	// })
	//
});

// // Mount the router
// router.use("/", userRouter);

export default userRouter;
