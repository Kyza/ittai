import { patch } from "../patcher";

export default /**
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {Object} {@link module:patcher.patch~patchData}
 * @memberof module:patcher
 * @tutorial patchingInstead
 */ function instead(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "instead", patchFunction);
}
