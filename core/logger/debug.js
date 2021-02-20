import { consoleCopy, createArguments } from "../logger";

/**
 * @param  {...any} args
 */
export default function debug(...args) {
	consoleCopy.debug(...createArguments(...args));
}
