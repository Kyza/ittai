/**
 * @module patcher
 */

import * as logger from "../logger";
import { randomString } from "../utils";

/**
 * A list of the currently patched components.
 */
export let patches = {};

/**
 *
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {object} {@link module:patcher.patch~patchData}
 * @tutorial patchingBefore
 */
export function before(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "before", patchFunction);
}
/**
 *
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {Object} {@link module:patcher.patch~patchData}
 * @tutorial patchingInstead
 */
export function instead(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "instead", patchFunction);
}
/**
 *
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {object} {@link module:patcher.patch~patchData}
 * @tutorial patchingAfter
 */
export function after(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "after", patchFunction);
}

/**
 * Unpatches all of the patches specified, or all of them if none are specified.
 * @param {string[]} [unpatches={@link module:patcher.patches}] An array patch names.
 */
export function unpatchAll(unpatches) {
	if (!Array.isArray(unpatches)) unpatches = patches;
	for (const object of Object.values(unpatches)) {
		for (const funct of Object.values(object)) {
			for (const patch of funct.patches) {
				patch.unpatch();
			}
		}
	}
}

/**
 *
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {string} type The type of patch to apply. `before`, `instead`, `after`.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {object} {@link module:utils/patcher.patch~patchData}
 * @tutorial patching
 */
export function patch(name, object, functionName, type, patchFunction) {
	const id = object.__ittai__ ?? randomString(25, Object.keys(patches));
	object.__ittai__ = object.__ittai__ ?? id;
	if (!patches[id]) patches[id] = {};

	/**
	 * @memberof module:utils/patcher
	 * @prop {string} name The name of the function being patched.
	 * @prop {string} type The type of the patch.
	 * @prop {function} patchFunction The original function.
	 * @prop {function} unpatch The function to call to unpatch.
	 */
	const patchData = {
		name,
		type,
		patchFunction,
		unpatch: function () {
			try {
				const patchIndex = patches[id][functionName].patches.indexOf(this);
				if (patchIndex === -1)
					throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
				// Delete patch.
				patches[id][functionName].patches.splice(patchIndex, 1);
				// Clean up the object if there are no patches left.
				if (patches[id][functionName].patches.length === 0) {
					// Restore original function.
					object[functionName] = patches[id][functionName].original;
					delete patches[id][functionName];
				}
				if (!Object.keys(patches[id]).length) {
					delete patches[id];
				}
			} catch (e) {
				logger.error(`Failed to unpatch ${name}.`, e);
			}
		},
	};

	if (!patches[id][functionName]) {
		patches[id][functionName] = {
			original: { ...object }[functionName],
			patches: [],
		};

		const props = { ...object[functionName] };

		object[functionName] = function (...args) {
			const functionData = patches[id][functionName];
			const befores = functionData.patches.filter((p) => p.type === "before");
			const insteads = functionData.patches.filter((p) => p.type === "instead");
			const afters = functionData.patches.filter((p) => p.type === "after");

			// Before patches.
			for (const before of befores) {
				try {
					args = before.patchFunction(this, args);
				} catch (e) {
					logger.error(`Error running before patch ${name}.`, e);
				}
			}

			// Instead patches.
			let res = {};
			let ranOnce = false;
			if (insteads.length === 0) {
				(res = functionData.original.call(this, ...args)), (ranOnce = true);
			} else {
				// Bad, fix later.
				for (const instead of insteads) {
					// Do trash merge with Lodash.
					try {
						(res = globalThis._.merge(
							res,
							instead.patchFunction(this, args) ?? {}
						)),
							(ranOnce = true);
					} catch (e) {
						logger.error(`Error running instead patch ${name}.`, e);
					}
				}
			}
			if (!ranOnce) {
				res = functionData.original.call(this, ...args);
			}

			// After patches.
			for (const after of afters) {
				try {
					res = after.patchFunction(this, args, res);
				} catch (e) {
					logger.error(`Error running after patch ${name}.`, e);
				}
			}

			return res;
		};
		Object.assign(object[functionName], props);
		object[functionName].toString = () =>
			patches[id][functionName].original.toString();
	}
	patches[id][functionName].patches.push(patchData);
	// patches.push(patchData);

	return patchData;
}
