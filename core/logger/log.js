import { consoleCopy, createArguments } from "../logger";

/**
 * @param  {...any} args
 */
export default function log(...args) {
	consoleCopy.log(...createArguments(...args));
}
