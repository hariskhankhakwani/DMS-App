export class Tag {
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    public static create(name: string): Tag {
        Tag.validate(name)
        const normalizedName = name.toLowerCase();

        return new Tag(normalizedName);
    }

    private static validate (name:string){
         if (!name || name.trim().length === 0) {
            throw new Error('Tag name cannot be empty');
        }

        if (name.trim().length < 2) {
            throw new Error('Tag name must be at least 2 characters long');
        }

        if (name.length > 50) {
            throw new Error('Tag name is too long (maximum 50 characters)');
        }

        const validTagRegex = /^[a-zA-Z0-9-]+$/;
        if (!validTagRegex.test(name)) {
            throw new Error('Tag name can only contain letters, numbers, and hyphens');
        }

        if (name.startsWith('-') || name.endsWith('-')) {
            throw new Error('Tag name cannot start or end with a hyphen');
        }

        if (name.includes('--')) {
            throw new Error('Tag name cannot contain consecutive hyphens');
        }

    }

    getName(): string {
        return this.name;
    }
}