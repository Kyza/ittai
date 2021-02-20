import { consoleCopy, createArguments } from "ittai/logger";

/**
 * @param  {...any} args
 */
export default function warn(...args) {
	consoleCopy.warn(...createArguments(...args));
}
