import { consoleCopy, createArguments } from "../logger";

/**
 * @param  {...any} args
 */
export default function group(...args) {
	consoleCopy.group(...createArguments(...args));
}
