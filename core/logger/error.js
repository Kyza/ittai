import { consoleCopy, createArguments } from "../logger";

/**
 * @param  {...any} args
 */
export default function error(...args) {
	consoleCopy.error(...createArguments(...args));
}
