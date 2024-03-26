// This is the offchain part of the smart contract.
// The code here is the one that will be authenticated.
// In this scenario it represents an imaginary backend api.
import * as CwebWallet from "@coinweb/wallet-lib";
import { NetworkName } from "@coinweb/wallet-lib/enums";
import { claimFilter } from "./constants";

// @ts-expect-error
const DEV_COINWEB_ENDPOINT = typeof window === "undefined" ? process.env.API_ENDPOINT_DEVNET : window.__API_URL__;

const cwebWalletNode = CwebWallet.connect_to_node(DEV_COINWEB_ENDPOINT as string);

export type IssuedClaim = CwebWallet.GqlIssuedClaim & {
  content: {
    key: {
      first_part: number | string;
      second_part: number | string;
    };
  };
};

export type ClaimsResponse = {
  result: IssuedClaim[] | Error;
  status: "success" | "error";
};

/**
 * Fetches a Coinweb claim from the network utilising the @coinweb/wallet-lib
 *
 * @returns {Promise<ClaimsResponse>} The claim(s) that was fetched
 */
export const fetchClaims = async (): Promise<ClaimsResponse> => {
  const claimFilters = [claimFilter];
  const networkToClaimFrom = NetworkName.DEVNET_L1A;
  const loadAllPages = true;

  try {
    const fetchedClaims = (await CwebWallet.fetch_claims(
      cwebWalletNode,
      claimFilters,
      networkToClaimFrom,
      loadAllPages
    )) as IssuedClaim[];

    return { result: fetchedClaims, status: "success" };
  } catch (error) {
    return { result: error, status: "error" };
  }
};
