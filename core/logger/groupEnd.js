import { consoleCopy, createArguments } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function groupEnd(...args) {
	consoleCopy.groupEnd(...createArguments(...args));
}
