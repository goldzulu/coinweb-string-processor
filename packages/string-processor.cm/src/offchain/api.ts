// This is the offchain part of the smart contract.
// The code here is the one that will be authenticated.
// In this scenario it represents a sample backend api.
import { ContractCall, DEFAULT_HANDLER_NAME, contractIssuer, readClaim, selfRegisterKey } from "@coinweb/contract-kit";
import { NetworkName } from "@coinweb/wallet-lib/enums";
import { STRING_PROCESSOR_TABLE, contractId } from "./constants";
import * as CwebWallet from "@coinweb/wallet-lib";
import * as bip39 from "bip39";
import createHmac from "create-hmac";
import { publicKeyCreate } from "secp256k1";

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
 * @param {claimFilters[]} claimFilters The array of filters to apply to the claim(s) to fetch
 * @returns {Promise<ClaimsResponse>} The claim(s) that was fetched
 */
export const fetchClaims = async (claimFilters: CwebWallet.GqlClaimFilter[]): Promise<ClaimsResponse> => {
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

/**
 * Generate a ContractCall with provided input string or array of strings
 *
 * @param {string | string[]} input The input to the contract call
 * @returns {CwebWallet.CustomUiCommand} The generated contract call
 */
export const generateContractCallOperation = (
  input: string | string[],
  methodHandler: string = DEFAULT_HANDLER_NAME
): CwebWallet.CustomUiCommand => {
  const inputArray = Array.isArray(input) ? input : [input];
  const firstKeyPart = STRING_PROCESSOR_TABLE;
  const secondKeyPart = inputArray.flat(Infinity).join(" ").trim() || undefined;

  const data = [methodHandler, firstKeyPart, secondKeyPart, inputArray];

  return {
    calls: [
      {
        contract_input: {
          authenticated: true, // hardcoded
          cost: "0x00000000000000000000000000000000000000000000000000000000000186a0", // hardcoded
          data,
        },
        contract_ref: {
          explicit: [],
          stored: [readClaim(contractIssuer(contractId), selfRegisterKey())],
        },
      } as ContractCall,
    ],
  };
};

const fromMasterSeed = (seed: Buffer): Buffer => {
  const digest = createHmac("sha512", Buffer.from("Bitcoin seed", "utf8")).update(seed).digest();
  const privateKey = digest.slice(0, 32);
  return privateKey;
};

export const prepareWallet = async (network): Promise<CwebWallet.Wallet> => {
  const mnemonic = "priority supply couple broccoli balcony sort flag keep original wrong pottery version"; // hardcoded
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const privateKey = fromMasterSeed(seed);
  const publicKey = publicKeyCreate(privateKey, true);

  const signCallback: CwebWallet.SignCallback = (msg: Uint8Array) => CwebWallet.sign(privateKey, msg);
  const walletConfig: CwebWallet.WalletConfig = {
    address: DEV_COINWEB_ENDPOINT,
    ws_address: "ws://coinweb-experimental-bitcoin-graphql-devnet.coinz.team/wallet",
    pub_key: Buffer.from(publicKey).toString("hex"),
    sign_callback: signCallback,
    shard: network,
    max_retry_time_secs: null,
    enable_retries: null,
  };

  return await CwebWallet.create_wallet(walletConfig);
};

export const prepareTransaction = async (callOp: CwebWallet.CustomUiCommand): Promise<CwebWallet.L2TransactionData> => {
  const wallet = await prepareWallet(NetworkName.DEVNET_L1A);

  return await CwebWallet.compose_ui_commands(
    wallet,
    [{ CustomV1: callOp as CwebWallet.CustomUiCommand }],
    NetworkName.DEVNET_L1A
  );
};

export const embedTransaction = async (transaction: CwebWallet.L2TransactionData): Promise<string> => {
  const wallet = await prepareWallet(NetworkName.DEVNET_L1A);

  return await CwebWallet.embed(wallet, transaction.l2_transaction);
};
