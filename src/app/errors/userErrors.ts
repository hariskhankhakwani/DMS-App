export class BaseUserError extends Error {
	_tag: string;
	code: number;
	constructor(message = "User application error") {
		super(message);
		this.name = "BaseUserError";
	}
}

export class UserCreationError extends BaseUserError {
	_tag = "UserCreationError";
	constructor(message = "User could not be Created ") {
		super(message);
		this.name = "UserCreationError";
		this.code = 500;
	}
}

export class UserDeletionError extends BaseUserError {
	_tag = "UserDeletionError";
	constructor(message = "User could not be Deleted ") {
		super(message);
		this.name = "UserDeletionError";
		this.code = 500;
	}
}

export class UserRetrievalError extends BaseUserError {
	_tag = "UserRetrievalError";
	constructor(message = "User could not be Retrieved ") {
		super(message);
		this.name = "UserRetrievalError";
		this.code = 500;
	}
}

export class UserNotFoundError extends BaseUserError {
	_tag = "UserNotFoundError";
	constructor(message = "User not found") {
		super(message);
		this.name = "UserNotFoundError";
		this.code = 404;
	}
}

export class UserAlreadyExistsError extends BaseUserError {
	_tag = "UserAlreadyExistsError";
	constructor(message = "User already exists") {
		super(message);
		this.name = "UserAlreadyExistsError";
		this.code = 409;
	}
}

export class IncorrectPasswordError extends BaseUserError {
	_tag = "IncorrectPasswordError";
	constructor(message = "Incorrect password") {
		super(message);
		this.name = "IncorrectPasswordError";
		this.code = 400;
	}
}

export class InvalidTokenError extends BaseUserError {
	_tag = "InvalidTokenError";
	constructor(message = "Invalid token") {
		super(message);
		this.name = "InvalidTokenError";
		this.code = 401;
	}
}

export class UnauthorizedUserError extends BaseUserError {
	_tag = "UnauthorizedUserError";
	constructor(message = "Unauthorized user") {
		super(message);
		this.name = "UnauthorizedUserError";
		this.code = 403;
	}
}

export class SelfDeletionError extends BaseUserError {
	_tag = "SelfDeletionError";
	constructor(message = "You cannot delete yourself") {
		super(message);
		this.name = "SelfDeletionError";
		this.code = 403;
	}
}

export class UserUpdateRoleError extends BaseUserError {
	_tag = "UserUpdateRoleError";
	constructor(message = "User could not be Updated Role ") {
		super(message);
		this.name = "UserUpdateRoleError";
		this.code = 500;
	}
}

export class UserAlreadyHasRoleError extends BaseUserError {
	_tag = "UserAlreadyHasRoleError";
	constructor(message = "User already has role") {
		super(message);
		this.name = "UserAlreadyHasRoleError";
		this.code = 400;
	}
}

export class NoAdminsFoundError extends BaseUserError {
	_tag = "NoAdminsFoundError";
	constructor(message = "No admins found") {
		super(message);
		this.name = "NoAdminsFoundError";
		this.code = 404;
	}
}
