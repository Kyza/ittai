import { consoleCopy, createArguments } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function group(...args) {
	consoleCopy.group(...createArguments(...args));
}
