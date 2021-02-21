import * as logger from "../logger";
import { randomString } from "../utilities";
import { patches } from "../patcher";

export default /**
 * @param {string} name The name of the patch. For debugging.
 * @param {any} object The object that the function is in.
 * @param {string} functionName The name of the function to patch.
 * @param {string} type The type of patch to apply. `before`, `instead`, `after`.
 * @param {function} patchFunction The code to patch into the function.
 * @returns {object} {@link module:utils/patcher.patch~patchData}
 * @memberof module:patcher
 * @tutorial patching
 */ function patch(name, object, functionName, type, patchFunction) {
	const id = object.__ittai__ ?? randomString(25, Object.keys(patches));
	object.__ittai__ = object.__ittai__ ?? id;
	if (!patches[id]) patches[id] = {};

	/**
	 * @memberof module:patcher
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
