import {
	type InferContractRouterInputs,
	type InferContractRouterOutputs,
	oc,
} from "@orpc/contract";
import { z } from "zod";
import {
	HashComparisonErrorSchema,
	HashGenerationErrorSchema,
	IncorrectPasswordErrorSchema,
	JwtGenerationErrorSchema,
	UserCreationDomainErrorSchema,
	UserCreationErrorSchema,
	UserNotFoundErrorSchema,
	UserRetrievalErrorSchema,
} from "./schema/errors";
import { UserAlreadyExistsErrorSchema } from "./schema/errors";
import {
	LoginResponseSchema,
	RegisterUserInputSchema,
} from "./schema/userSchema";
import { UserResponseSchema } from "./schema/userSchema";

export const userContract = oc.router({
	register: oc
		.route({
			path: "/register",
			method: "POST",
		})
		.input(RegisterUserInputSchema)
		.output(
			z.object({
				message: z.string(),
				data: z.union([
					UserResponseSchema,
					UserRetrievalErrorSchema,
					UserAlreadyExistsErrorSchema,
					HashGenerationErrorSchema,
					UserCreationDomainErrorSchema,
					UserCreationErrorSchema,
				]),
			}),
		),

	login: oc
		.route({
			path: "/login",
			method: "POST",
		})
		.input(
			z.object({
				email: z.string().email(),
				password: z.string(),
			}),
		)
		.output(
			z.object({
				message: z.string(),
				data: z.union([
					LoginResponseSchema,
					UserRetrievalErrorSchema,
					UserNotFoundErrorSchema,
					HashComparisonErrorSchema,
					IncorrectPasswordErrorSchema,
					JwtGenerationErrorSchema,
				]),
			}),
		),

	// getAllUsers: oc
	// 	.route({
	// 		path: "/fetchAll",
	// 		method: "GET",
	// 	})
	// 	.input(
	// 		z.object({
	// 			authorization: z.string(),
	// 		}),
	// 	)
	// 	.output(
	// 		z.object({
	// 			message: z.string(),
	// 			data: z.array(UserResponseSchema),
	// 		}),
	// 	),

	// deleteUser: oc
	// 	.route({
	// 		path: "/delete",
	// 		method: "DELETE",
	// 	})
	// 	.input(
	// 		z.object({
	// 			authorization: z.string(),
	// 			userId: z.string(),
	// 		}),
	// 	)
	// 	.output(
	// 		z.object({
	// 			message: z.string(),
	// 			data: z.boolean(),
	// 		}),
	// 	),

	// updateRole: oc
	// 	.route({
	// 		path: "/updateRole",
	// 		method: "POST",
	// 	})
	// 	.input(
	// 		z.object({
	// 			authorization: z.string(),
	// 			userId: z.string(),
	// 			role: z.enum([RoleType.ADMIN, RoleType.USER]),
	// 		}),
	// 	)
	// 	.output(
	// 		z.object({
	// 			message: z.string(),
	// 			data: z.boolean(),
	// 		}),
	// 	),
});

export type userInputs = InferContractRouterInputs<typeof userContract>;
export type userOutputs = InferContractRouterOutputs<typeof userContract>;
