import { consoleCopy, createArguments } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function log(...args) {
	consoleCopy.log(...createArguments(...args));
}
