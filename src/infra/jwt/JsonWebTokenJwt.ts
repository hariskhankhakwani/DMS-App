import { injectable, inject } from 'inversify';
import { sign, verify, decode } from 'jsonwebtoken';
import type { IJwt } from '../../app/ports/jwt/IJwt';
import type { ILogger } from '../../app/ports/logger/ILogger';
import { JWTAccessTokenPayload } from '../../app/dtos/userDtos';
import { TYPES } from '../di/inversify/types';

@injectable()
export class JsonWebTokenJwt implements IJwt {
  private readonly secretKey: string;

  constructor(@inject(TYPES.ILogger) private readonly logger: ILogger) {
    this.secretKey = process.env.secret as string;
  }

  async generate(payload: JWTAccessTokenPayload): Promise<string> {
    try {
      this.logger.debug('Starting to generate JWT token ');
      const token = sign({ data: payload }, this.secretKey);

      this.logger.debug('JWT token generated successfully');
      return token;
    } catch (error) {
      this.logger.error(`Error generating JWT token: ${error}`);
      throw new Error('Failed to generate token');
    }
  }

  async verify(token: string): Promise<boolean> {
    try {
      this.logger.debug('Starting to verify JWT token');
      verify(token, this.secretKey);
      this.logger.debug('JWT token verified successfully');
      return true;
    } catch (error) {
      this.logger.warn(`Invalid JWT token: ${error}`);
      return false;
    }
  }

  async decode(token: string): Promise<{ header: any; payload: unknown; signature: any }> {
    try {
      const decoded = decode(token, { complete: true });

      if (!decoded) {
        throw new Error('Failed to decode token');
      }

      this.logger.debug('JWT token decoded successfully');

      return {
        header: decoded.header,
        payload: decoded.payload,
        signature: decoded.signature,
      };
    } catch (error) {
      this.logger.error(`Error decoding JWT token: ${error}`);
      throw new Error('Failed to decode token');
    }
  }
}
