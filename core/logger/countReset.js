import { consoleCopy } from "../logger";

export default /**
 * @memberof module:logger
 * @param  {...any} args
 */ function countReset(...args) {
	consoleCopy.countReset(...args);
}
