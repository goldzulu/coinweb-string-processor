import type { GqlIssuedClaim } from '@coinweb/wallet-lib';

export type IssuedClaim = GqlIssuedClaim & {
  content: {
    key: {
      first_part: number | string;
      second_part: number | string;
    };
  };
};

export type ClaimsResponse = {
  result: IssuedClaim[] | Error;
  status: 'success' | 'error';
};

export type FetchedClaim = {
  body: string;
  firstKey: string | number;
  secondKey: string | number;
};

type MethodHandler = string;
type MethodHandlerFirstKey = string;
type MethodHandlerSecondKey = string;
type MethodHandlerBody = string;
export type MethodArguments = [MethodHandler, MethodHandlerFirstKey, MethodHandlerSecondKey, MethodHandlerBody];
