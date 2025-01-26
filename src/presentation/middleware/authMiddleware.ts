import { Effect } from "effect";
import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { JwtVerificationError } from "../../app/errors/jwtError";
import type { IJwt } from "../../app/ports/jwt/IJwt";
import container from "../../infra/di/inversify/inversify.config";
import { TYPES } from "../../infra/di/inversify/types";

const jwtService = container.get<IJwt>(TYPES.IJwt);

export const authMiddleware = (
	expressReq: Request,
	expressRes: Response,
	expressNext: NextFunction,
) => {
	const authHeader = expressReq.headers.authorization;
	if (!authHeader) {
		expressRes.status(401).json({ message: "Authorization header missing" });

		return;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		expressRes.status(401).json({ message: "Token missing" });
		return;
	}

	Effect.runPromise(
		jwtService.verify(token).pipe(
			Effect.map((decodedToken) => {
				expressReq.body.loggedInUserEmail = (
					decodedToken as JwtPayload
				).data.email;
				expressReq.body.loggedInUserRole = (
					decodedToken as JwtPayload
				).data.role;
				expressReq.body.loggedInUserId = (decodedToken as JwtPayload).data.id;
				return decodedToken;
			}),
		),
	)
		.then(() => {
			expressNext();
		})
		.catch((error) => {
			expressRes.status(401).json({ message: error.message });
			return;
		});
};
