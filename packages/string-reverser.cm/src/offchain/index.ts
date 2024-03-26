import * as api from "./api";
import * as constants from "./constants";
import type { IssuedClaim } from "./api";

export type { IssuedClaim };

export type FetchedClaim = {
  body: string;
  firstKey: string | number;
  secondKey: string | number;
};

export const getContractId = async (): Promise<string> => {
  return constants.contractId;
};

export const getReversedStrings = async (): Promise<FetchedClaim> => {
  return api.fetchClaims().then((claimsResponse) => {
    if (claimsResponse.status === "error") {
      throw new Error("Failed to fetch claims from the network.");
    }

    if (claimsResponse.status === "success") {
      const [helloWorldClaim] = claimsResponse.result as IssuedClaim[];

      if (helloWorldClaim?.content?.body && helloWorldClaim?.content?.key) {
        return {
          body: helloWorldClaim.content.body as string,
          firstKey: helloWorldClaim.content.key.first_part,
          secondKey: helloWorldClaim.content.key.second_part,
        };
      }

      throw new Error("Claim not found.");
    }
  });
};
