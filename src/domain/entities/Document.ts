import { v4 as uuidv4 } from "uuid";
import { Metadata } from "../valueObjects/Metadata";

export interface IDocumentItem {
    id: string;
    name: string;
    content: Uint8Array;
    metaData: Metadata;
}

export class DocumentItem implements IDocumentItem {
    id: string;
    name: string;
    content: Uint8Array;
    metaData: Metadata;

    private constructor() {
        this.id = uuidv4();
    }
    
    public static create(name: string, content: Uint8Array, author: string): DocumentItem {
        const document = new DocumentItem();
        
        document.setName(name);
        document.setContent(content);
        document.metaData = Metadata.create(author);
        
        return document;
    }
     
    public setName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Document name cannot be empty');
        }

        if (name.trim().length < 3) {
            throw new Error('Document name must be at least 3 characters long');
        }

        if (name.length > 255) {
            throw new Error('Document name is too long (maximum 255 characters)');
        }

        const validNameRegex = /^[a-zA-Z0-9\s\-_.()]+$/;
        if (!validNameRegex.test(name)) {
            throw new Error('Document name contains invalid characters');
        }

        this.name = name.trim();
    }

    public setContent(content: Uint8Array): void {
        if (!content || content.length === 0) {
            throw new Error('Document content cannot be empty');
        }

        const MAX_SIZE = 100 * 1024 * 1024; // 100MB
        if (content.length > MAX_SIZE) {
            throw new Error('Document content exceeds maximum size of 100MB');
        }

        this.content = content;
    }
    
    public getId(): string {
        return this.id;
    }
    
    public getName(): string {
        return this.name;
    }

    public getContent(): Uint8Array {
        return this.content;
    }

    public getMetadata(): Metadata {
        return this.metaData;
    }

    serialize(): IDocumentItem {
        return {
            id: this.id,
            name: this.name,
            content: this.content,
            metaData: this.metaData
        };
    }

    public static deserialize(obj: IDocumentItem): DocumentItem {
        const document = new DocumentItem();
        document.id = obj.id;
        document.setName(obj.name);
        document.setContent(obj.content);
        document.metaData = obj.metaData;
        
        return document;
    }

    public static stringToBytes(str: string): Uint8Array {
        return new TextEncoder().encode(str);
    }

    public static bytesToString(bytes: Uint8Array): string {
        return new TextDecoder().decode(bytes);
    }
}