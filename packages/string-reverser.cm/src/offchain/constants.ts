import type { GqlClaimFilter } from "@coinweb/wallet-lib";
import onchainPackage from "../../package.json";

/**
 * The contract id is fetched from the name of the contract module in ../out
 * The contract module's name is always `cweb_<<contract id>>` which is subtracted
 * to construct a hex version of the contract id.
 */
export const contractId = `0x${onchainPackage.name.substring(5)}`;

/**
 * The claim filter is used to fetch the claim that is been checked.
 * Issuer and the first key are used to identify the claim.
 */
export const claimFilter: GqlClaimFilter = {
  issuer: { FromSmartContract: contractId },
  keyFirstPart: "FIRST KEY",
  keySecondPart: "SECOND KEY",
  startsAtKeySecondPart: null,
  endsAtKeySecondPart: null,
};
