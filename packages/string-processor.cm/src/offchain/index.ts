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

export const readClaim = async (input?: string): Promise<FetchedClaim[]> => {
  const inputArray = Array.isArray(input) ? input : [input];
  const keySecondPart = inputArray.flat(Infinity).join(" ").trim() || undefined;

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
        const fetchedClaims = claimsResponse.result as IssuedClaim[];
        if (fetchedClaims.length > 0) {
          return fetchedClaims.map((claim) => ({
            body: claim.content.body as string,
            firstKey: claim.content.key.first_part,
            secondKey: claim.content.key.second_part,
          }));
        }

        throw new Error("No claims found.");
      }
    });
};

export const generateCallOp = async (input: string, methodHandler?: string) => {
  return api.generateContractCallOperation(input, methodHandler);
};

export const prepareTransaction = async (callOp: CustomUiCommand) => {
  return api.prepareTransaction(callOp);
};

export const embedTransaction = async (transaction: L2TransactionData) => {
  return api.embedTransaction(transaction);
};