import { os, type Context, ORPCError } from "@orpc/server";
import { Effect } from "effect";
import type { JwtPayload } from "jsonwebtoken";
import type { IJwt } from "../../../app/ports/jwt/IJwt";
import container from "../../../infra/di/inversify/inversify.config";
import { TYPES } from "../../../infra/di/inversify/types";

export const pub = os.$context<Context>();

const jwtService = container.get<IJwt>(TYPES.IJwt);

export const orpcAuthMiddleware = pub.middleware(
	async ({ context, next }, input) => {
		const authHeader = context.headers?.authorization;

		if (!authHeader) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Authorization header missing",
				status: 401,
			});
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Token missing",
				status: 401,
			});
		}

		try {
			const decodedToken = await Effect.runPromise(jwtService.verify(token));
			const userData = (decodedToken as JwtPayload).data;

			return next({
				context: {
					headers: context.headers,
					user: {
						id: userData.id,
						email: userData.email,
						role: userData.role,
					},
				},
			});
		} catch (error) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid token",
				status: 401,
			});
		}
	},
);
