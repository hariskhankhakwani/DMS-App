export class HashError extends Error {
	code: number;
	constructor(message = "Hashing Error") {
		super(message);
		this.name = "HashError";
		this.code = 502;
	}
}

export class HashGenerationError extends HashError {
	constructor(message = "Failed to generate hash") {
		super(message);
		this.name = "HashGenerationError";
	}
}

export class HashComparisonError extends HashError {
	constructor(message = "Failed to compare hash") {
		super(message);
		this.name = "HashComparisonError";
	}
}
