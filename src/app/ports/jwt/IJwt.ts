export interface IJwt {
    generate(payload: unknown ): Promise<string>; 
    verify(token: string): Promise<boolean>;  
    decode(token: string): Promise<{ header: any; payload: unknown ; signature: any }>;
  }
  