import { Backend } from "./backend";
import { ErrorCode } from "./errors";
import { GoodConditionsError } from "./errors";
import { createChallenge } from "./libs/create-challenge";
import { getCreds } from "./libs/creds";
import { createKeypair } from "./libs/trust-browser";
import { unlinkBrowser } from "./libs/unlink-browser";

export const frontend = {
  createKeypair,
  createChallenge,
  unlinkBrowser,
  getCreds,
};

export { Backend, GoodConditionsError, ErrorCode };
