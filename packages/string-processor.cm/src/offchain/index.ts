import * as api from "./api";
import * as constants from "./constants";
import type { IssuedClaim } from "./api";
import type { L2TransactionData, GqlClaimFilter, CustomUiCommand } from "@coinweb/wallet-lib";

export * from "./constants";

export type { IssuedClaim };

export type FetchedClaim = {
  body: string;
  firstKey: string | number;
  secondKey: string | number;
};

export const getContractId = async (): Promise<string> => {
  return constants.contractId;
};

export const readClaim = async (input: string): Promise<FetchedClaim> => {
  const inputArray = Array.isArray(input) ? input : [input];
  const keySecondPart = inputArray.flat(Infinity).join(" ").trim();

  return api
    .fetchClaims([
      {
        issuer: { FromSmartContract: constants.contractId },
        keyFirstPart: constants.STRING_PROCESSOR_TABLE,
        keySecondPart,
        startsAtKeySecondPart: null,
        endsAtKeySecondPart: null,
      },
    ] as GqlClaimFilter[])
    .then((claimsResponse) => {
      if (claimsResponse.status === "error") {
        throw new Error("Failed to fetch claims from the network.");
      }

      if (claimsResponse.status === "success") {
        const [fetchedClaim] = claimsResponse.result as IssuedClaim[];

        if (fetchedClaim?.content?.body && fetchedClaim?.content?.key) {
          return {
            body: fetchedClaim.content.body as string,
            firstKey: fetchedClaim.content.key.first_part,
            secondKey: fetchedClaim.content.key.second_part,
          };
        }

        throw new Error("Claim not found.");
      }
    });
};

export const generateCallOp = async (input: string) => {
  return api.generateContractCallOperation(input);
};

export const prepareTransaction = async (callOp: CustomUiCommand) => {
  return api.prepareTransaction(callOp);
};

export const embedTransaction = async (transaction: L2TransactionData) => {
  return api.embedTransaction(transaction);
};
