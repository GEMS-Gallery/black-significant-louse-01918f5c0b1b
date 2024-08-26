import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Book {
  'id' : bigint,
  'title' : string,
  'description' : string,
  'author' : string,
  'imageUrl' : string,
  'price' : bigint,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Book } |
  { 'err' : string };
export interface _SERVICE {
  'getBookDetails' : ActorMethod<[bigint], Result_1>,
  'getBooks' : ActorMethod<[], Array<Book>>,
  'getUserPurchases' : ActorMethod<[Principal], Array<bigint>>,
  'purchaseBook' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
