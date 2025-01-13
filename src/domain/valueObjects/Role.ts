export type Permission = 'create' | 'read' | 'update' | 'delete';

export enum RoleType {
    ADMIN="admin",
    USER ="user",
  }

export class Role {
    private readonly type: RoleType;
    private readonly permissions: Permission[];

    private static readonly ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
        admin: ['create', 'read', 'update', 'delete'],
        user: ['read', 'update']
    };

    private constructor(type: RoleType) {
        this.type = type;
        this.permissions = Role.ROLE_PERMISSIONS[type];
    }

    public static create(type: RoleType): Role {
        if (!Object.keys(Role.ROLE_PERMISSIONS).includes(type)) {
            throw new Error(`Invalid role type. Must be one of: ${Object.keys(Role.ROLE_PERMISSIONS).join(', ')}`);
        }

        return new Role(type);
    }

    public hasPermission(permission: Permission): boolean {
        return this.permissions.includes(permission);
    }

    public getPermissions(): Permission[] {
        return [...this.permissions];
    }

    public getType(): RoleType {
        return this.type;
    }

    public equals(other: Role): boolean {
        return this.type === other.type;
    }

    public isAdmin(): boolean {
        return this.type === 'admin';
    }

    public isUser(): boolean {
        return this.type === 'user';
    }

    serialize(): { type: RoleType; permissions: Permission[] } {
        return {
            type: this.type,
            permissions: [...this.permissions]
        };
    }

    public static deserialize(data: { type: RoleType }): Role {
        return Role.create(data.type);
    }

    public static createAdminRole(): Role {
        return Role.create(RoleType.ADMIN);
    }

    public static createUserRole(): Role {
        return Role.create(RoleType.USER);
    }
}