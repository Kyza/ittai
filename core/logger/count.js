import { consoleCopy } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function count(...args) {
	consoleCopy.count(...args);
}
