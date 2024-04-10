import onchainPackage from "../../package.json";

/**
 * The contract id is fetched from the name of the contract module in ../out
 * The contract module's name is always `cweb_<<contract id>>` which is subtracted
 * to construct a hex version of the contract id.
 */
export const contractId = `0x${onchainPackage.name.substring(5)}`;

/**
 * This constant will be used as the claim table identifier (first key part of the claim)
 * https://docs.coinweb.io/develop/reactive-smart-contracts/develop-claims-storage
 */
export const STRING_PROCESSOR_TABLE = "STRING-PROCESSOR-TABLE";
