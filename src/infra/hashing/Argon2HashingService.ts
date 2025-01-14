import { inject, injectable } from "inversify";
import { TYPES } from "../di/inversify/types";

import type{ IHashing } from "../../app/ports/hashing/IHashing";
import { hash, verify } from 'argon2';
import type{ ILogger } from "../../app/ports/logger/ILogger";

@injectable()
export class Argon2HashingService implements IHashing {

    private logger : ILogger
    constructor(@inject( TYPES.ILogger ) logger: ILogger) {
        this.logger = logger;
    }
    async Hash(text: string): Promise<string> {
        try {
            this.logger.debug('Starting to hash text');
            
            const hashedText = await hash(text);

            this.logger.debug('Text hashed successfully');
            return hashedText;
        } catch (error) {
            this.logger.error(`Failed to hash text: ${error}`);
            throw new Error('Failed to hash text');
        }
    }

    async Compare(text: string, hashedText: string): Promise<boolean> {
        try {
            this.logger.debug('Starting to compare text with hash');
            
            const isMatch = await verify(hashedText, text);
            
            this.logger.info(`Hash comparison completed. Match: ${isMatch}`);
            return isMatch;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to compare hash: ${errorMessage}`);
            throw new Error('Failed to compare hash');
        }
    }


}