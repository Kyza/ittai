import { consoleCopy, createArguments } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function debug(...args) {
	consoleCopy.debug(...createArguments(...args));
}
