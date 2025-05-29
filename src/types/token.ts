
export interface BankProduct{
  subscribeId: number
  name: string
  balance:number
  imageUrl:string
}


export interface Token {
  bankImageUrl: string;
  currency: string;
  name: string;
  balance: number;
  product: BankProduct[] | null;
  krw :string;
}