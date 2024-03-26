import type { NewTx, Context, ContractHandlers } from "@coinweb/contract-kit";
import {
  getContractId,
  continueTx,
  passCwebFrom,
  contractIssuer,
  store,
  genericClaim,
  claimKey,
  toHex,
  addMethodHandler,
  SELF_REGISTER_HANDLER_NAME,
  executeHandler,
  getMethodArguments,
  DEFAULT_HANDLER_NAME,
} from "@coinweb/contract-kit";
import { selfRegisterHandler } from "@coinweb/self-register";

function stringReverser(...stringsToReverse: string[]): string {
  return stringsToReverse
    .flat(Infinity)
    .map((str) => str.split("").reverse().join(""))
    .join(" ");
}

function logic(context: Context): NewTx[] {
  const { tx } = context;
  const contractId = getContractId(tx);

  const [firstPart, secondPart, body] = getMethodArguments(context).slice(1);

  if (typeof firstPart !== "string") {
    throw new Error("Invalid arguments, first key part must be a string");
  }

  if (Array.isArray(body)) {
    if (body.length < 1) {
      throw new Error("Invalid arguments, body must be an array and contain at least one string to reverse");
    }

    if (body.some((arg) => typeof arg !== "string")) {
      throw new Error("Invalid arguments, body array must be composed of strings");
    }
  } else if (typeof body !== "string") {
    throw new Error("Invalid arguments, body must be a string or an array of strings");
  }

  return [
    continueTx([
      passCwebFrom(contractIssuer(contractId), 200),
      store(
        genericClaim(
          claimKey(firstPart, secondPart),
          Array.isArray(body) ? stringReverser(...body) : stringReverser(body),
          toHex(0)
        )
      ),
    ]),
  ];
}

export function cwebMain() {
  const module: ContractHandlers = { handlers: {} };
  addMethodHandler(module, DEFAULT_HANDLER_NAME, logic);
  addMethodHandler(module, SELF_REGISTER_HANDLER_NAME, selfRegisterHandler);
  executeHandler(module);
}
