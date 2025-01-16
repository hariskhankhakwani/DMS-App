export interface IHashing {
  Hash(text: string): Promise<string>;
  Compare(text: string, hashedText: string): Promise<boolean>;
}
