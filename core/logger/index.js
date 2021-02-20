/**
 * @module logger
 */

export const consoleCopy = { ...console };

export { default as createArguments } from "./createArguments";

export { default as log } from "./log";
export { default as debug } from "./debug";
export { default as warn } from "./warn";
export { default as error } from "./error";
export { default as group } from "./group";
export { default as groupEnd } from "./groupEnd";
export { default as count } from "./count";
export { default as countReset } from "./countReset";
