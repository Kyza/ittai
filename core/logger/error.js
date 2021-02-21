import { consoleCopy, createArguments } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function error(...args) {
	consoleCopy.error(...createArguments(...args));
}
