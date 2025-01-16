import { v4 as uuidv4 } from 'uuid';
import { Email } from '../valueObjects/Email';
import { Role, RoleType } from '../valueObjects/Role';
import type { DocumentItem } from '../entities/Document';

export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: Email;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type TSerializedUser = Omit<IUser, 'email' | 'role'> & {
  email: string;
  role: RoleType;
};

export class User {
  private id: string;
  private firstName: string;
  private lastName: string;
  private email: Email;
  private password: string;
  private role: Role;
  private createdAt: Date;
  private updatedAt: Date;
  private documents: DocumentItem[];

  private constructor() {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.documents = [];
  }

  public static create(firstName: string, lastName: string, email: Email, password: string, role?: Role): User {
    const user = new User();

    user.setFirstName(firstName);
    user.setLastName(lastName);
    user.setPassword(password);
    user.email = email;
    user.setRole(role || Role.createUserRole());

    return user;
  }

  public setRole(role: Role): void {
    if (!role) {
      throw new Error('Role cannot be null or undefined');
    }
    this.role = role;
    this.updatedAt = new Date();
  }

  public setFirstName(firstName: string): void {
    User.validateName(firstName);
    this.firstName = firstName.trim();
    this.updatedAt = new Date();
  }

  public setLastName(lastName: string): void {
    User.validateName(lastName);
    this.lastName = lastName.trim();
    this.updatedAt = new Date();
  }

  public setPassword(password: string): void {
    User.validatePassword(password);
    this.password = password;
    this.updatedAt = new Date();
  }

  public hasPermission(permission: 'create' | 'read' | 'update' | 'delete'): boolean {
    return this.role.hasPermission(permission);
  }

  public isAdmin(): boolean {
    return this.role.isAdmin();
  }

  addDocument(doc: DocumentItem) {
    this.documents.push(doc);
  }

  public getId(): string {
    return this.id;
  }
  public getFirstName(): string {
    return this.firstName;
  }
  public getLastName(): string {
    return this.lastName;
  }
  public getEmail(): Email {
    return this.email;
  }
  public getRole(): Role {
    return this.role;
  }
  public getPassword(): string {
    return this.password;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
  public getDocuments(): DocumentItem[] {
    return [...this.documents];
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (name.length > 50) {
      throw new Error('Name is too long (maximum 50 characters)');
    }
    const validNameRegex = /^[a-zA-Z\s\-']+$/;
    if (!validNameRegex.test(name)) {
      throw new Error('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
  }

  private static validatePassword(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
      throw new Error('Password is too long (maximum 128 characters)');
    }
  }

  // Serialization methods
  public serialize() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email.serialize(),
      role: this.role.serialize(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static deserialize(obj: TSerializedUser): User {
    const user = new User();
    user.id = obj.id;
    user.setFirstName(obj.firstName);
    user.setLastName(obj.lastName);
    user.email = Email.create(obj.email);
    user.setRole(Role.create(obj.role));
    return user;
  }
}
