export class JwtError extends Error {
	code: number;
	constructor(message = "Jwt service Error") {
		super(message);
		this.name = "JwtError";
		this.code = 502;
	}
}

export class JwtGenerationError extends JwtError {
	constructor(message = "Failed to generate JWT token") {
		super(message);
		this.name = "JwtGenerationError";
	}
}

export class JwtVerificationError extends JwtError {
	constructor(message = "Failed to verify JWT token") {
		super(message);
		this.name = "JwtVerificationError";
	}
}
