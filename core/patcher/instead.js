import { patch } from "../patcher";

/**
 *
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {Object} {@link module:patcher.patch~patchData}
 * @tutorial patchingInstead
 */
export default function instead(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "instead", patchFunction);
}
