import { consoleCopy, createArguments } from "../logger";

/**
 * @param  {...any} args
 */
export default function groupEnd(...args) {
	consoleCopy.groupEnd(...createArguments(...args));
}
