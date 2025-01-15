
    export class BaseUserError extends Error {
        code: number;
        constructor(message: string = 'User application error') {
          super(message);
          this.name = 'BaseUserError';
        }
    }
      
    export class UserNotFoundError extends BaseUserError {
        constructor(message: string = 'User not found') {
          super(message);
          this.name = 'UserNotFoundError';
          this.code = 404;
        }
    }
      
    export class UserAlreadyExistsError extends BaseUserError {
        constructor(message: string = 'User already exists') {
          super(message);
          this.name = 'UserAlreadyExistsError';
          this.code = 409;
        }
    }
      
    export class IncorrectPasswordError extends BaseUserError {
        constructor(message: string = 'Incorrect password') {
          super(message);
          this.name = 'IncorrectPasswordError';
          this.code = 400;
        }
    }
    
    export class InvalidTokenError extends BaseUserError {
        constructor(message: string = 'Invalid token') {
          super(message);
          this.name = 'InvalidTokenError';
          this.code = 401;
        }
    }