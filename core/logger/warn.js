import { consoleCopy, createArguments } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function warn(...args) {
	consoleCopy.warn(...createArguments(...args));
}
