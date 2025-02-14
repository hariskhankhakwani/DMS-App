import { z } from "zod";
import { RoleType } from "../../../../domain/valueObjects/Role";

export const RegisterUserInputSchema = z.object({
	firstName: z.string().min(2).max(50),
	lastName: z.string().min(2).max(50),
	email: z.string().email(),
	password: z.string().min(8),
});

export const UserResponseSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	role: z.object({
		type: z.enum([RoleType.ADMIN, RoleType.USER]),
		permissions: z.array(z.enum(["create", "read", "update", "delete"])),
	}),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// export const LoginResponseSchema = z.object({
// 	accessToken: z.string(),
// 	id: z.string(),
// 	email: z.string(),
// });
export const LoginResponseSchema = z.object({
	accessToken: z.string(),
	user: z.string(),
	role: z.enum([RoleType.ADMIN, RoleType.USER]),
});
