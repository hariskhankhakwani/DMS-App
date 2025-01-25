// Base error class for all user-related errors
export class UserDomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, UserDomainError.prototype);
	}
}

// Role-related errors
export class InvalidRoleError extends UserDomainError {
	constructor(message = "Role cannot be null or undefined") {
		super(message);
		Object.setPrototypeOf(this, InvalidRoleError.prototype);
	}
}

// Name-related errors
export class InvalidNameError extends UserDomainError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidNameError.prototype);
	}
}

export class EmptyNameError extends InvalidNameError {
	constructor() {
		super("Name cannot be empty");
		Object.setPrototypeOf(this, EmptyNameError.prototype);
	}
}

export class NameTooShortError extends InvalidNameError {
	constructor() {
		super("Name must be at least 2 characters long");
		Object.setPrototypeOf(this, NameTooShortError.prototype);
	}
}

export class NameTooLongError extends InvalidNameError {
	constructor() {
		super("Name is too long (maximum 50 characters)");
		Object.setPrototypeOf(this, NameTooLongError.prototype);
	}
}

export class InvalidNameCharactersError extends InvalidNameError {
	constructor() {
		super("Name can only contain letters, spaces, hyphens, and apostrophes");
		Object.setPrototypeOf(this, InvalidNameCharactersError.prototype);
	}
}

// Password-related errors
export class InvalidPasswordError extends UserDomainError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidPasswordError.prototype);
	}
}

export class EmptyPasswordError extends InvalidPasswordError {
	constructor() {
		super("Password cannot be empty");
		Object.setPrototypeOf(this, EmptyPasswordError.prototype);
	}
}

export class PasswordTooShortError extends InvalidPasswordError {
	constructor() {
		super("Password must be at least 8 characters long");
		Object.setPrototypeOf(this, PasswordTooShortError.prototype);
	}
}

export class PasswordTooLongError extends InvalidPasswordError {
	constructor() {
		super("Password is too long (maximum 128 characters)");
		Object.setPrototypeOf(this, PasswordTooLongError.prototype);
	}
}
