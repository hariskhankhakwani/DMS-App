export class Email {
  private constructor(readonly email: string) {
    this.email = email;
  }

  private static validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (email.length > 254) {
      throw new Error('Email is too long');
    }

    if (email.includes('..')) {
      throw new Error('Email cannot contain consecutive dots');
    }

    const localPart = email.split('@')[0];
    if (localPart.length > 64) {
      throw new Error('Local part of email cannot exceed 64 characters');
    }
  }

  public static create(email: string): Email {
    Email.validate(email);
    return new Email(email.toLowerCase());
  }

  public getEmail(): string {
    return this.email;
  }

  serialize(): string {
    return this.email;
  }
}
