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
import { REVERSER, TOGGLE_CASER } from "../offchain/constants";

function stringReverser(...stringsToReverse: string[]): string {
  return stringsToReverse
    .flat(Infinity)
    .map((str) => str.trim().split("").reverse().join(""))
    .join(" ");
}

function stringToggleCaser(...stringsToToggleCase: string[]): string {
  function toggleCaseString(str: string): string {
    let spacesCounter = 0;
    return str
      .trim()
      .replace(/\s+/g, " ")
      .split("")
      .map((char, idx) => {
        if (char === " ") {
          spacesCounter += 1;
          return char;
        }
        return (idx - spacesCounter) % 2 > 0 ? char.toUpperCase() : char.toLowerCase();
      })
      .join("");
  }

  return stringsToToggleCase.flat(Infinity).map(toggleCaseString).join(" ");
}

const withValidateInputArguments = (processor: (context: Context) => NewTx[]) => (context: Context) => {
  const [, secondPart, body] = getMethodArguments(context).slice(1);
  if (typeof secondPart !== "string") {
    throw new Error("Invalid arguments, second key part must be a string");
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

  return processor(context);
};

function stringProcessor(body: string | string[]): string {
  return stringToggleCaser(stringReverser(...(Array.isArray(body) ? body : [body])));
}

function processStrings(context: Context): NewTx[] {
  const { tx } = context;
  const contractId = getContractId(tx);

  const [firstPart, secondPart, body] = getMethodArguments(context).slice(1);

  return [
    continueTx([
      passCwebFrom(contractIssuer(contractId), 200),
      store(genericClaim(claimKey(firstPart, secondPart), stringProcessor(body), toHex(0))),
    ]),
  ];
}

function onlyReverse(context: Context): NewTx[] {
  const { tx } = context;
  const contractId = getContractId(tx);

  const [firstPart, secondPart, body] = getMethodArguments(context).slice(1);

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

function onlyToggleCase(context: Context): NewTx[] {
  const { tx } = context;
  const contractId = getContractId(tx);

  const [firstPart, secondPart, body] = getMethodArguments(context).slice(1);

  return [
    continueTx([
      passCwebFrom(contractIssuer(contractId), 200),
      store(
        genericClaim(
          claimKey(firstPart, secondPart),
          Array.isArray(body) ? stringToggleCaser(...body) : stringToggleCaser(body),
          toHex(0)
        )
      ),
    ]),
  ];
}

export function cwebMain() {
  const module: ContractHandlers = { handlers: {} };
  addMethodHandler(module, DEFAULT_HANDLER_NAME, withValidateInputArguments(processStrings));
  addMethodHandler(module, TOGGLE_CASER, withValidateInputArguments(onlyToggleCase));
  addMethodHandler(module, REVERSER, withValidateInputArguments(onlyReverse));
  addMethodHandler(module, SELF_REGISTER_HANDLER_NAME, selfRegisterHandler);
  executeHandler(module);
}
