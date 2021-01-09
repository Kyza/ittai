import logger from "./logger";

function dirtyObject(object) {
	if (!object.__ittaiPatches__) object.__ittaiPatches__ = [];
}

function cleanObject(object) {
	if (object.__ittaiPatches__) delete object.__ittaiPatches__;
}

export default {
	patch: function (name, object, functionName, type, patch) {
		dirtyObject(object);
		const patchData = {
			name,
			type,
			functionName,
			patch,
			original: { ...object }[functionName],
			unpatch: function () {
				try {
					const patchIndex = object.__ittaiPatches__.indexOf(this);
					if (patchIndex === -1)
						throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
					const currentPatch = object.__ittaiPatches__[patchIndex];
					// Restore original function.
					object[functionName] = currentPatch.original;
					// Delete patch.
					object.__ittaiPatches__.splice(patchIndex, 1);
					// Clean up the object if there are no patches left.
					if (object.__ittaiPatches__.length === 0) cleanObject(object);
				} catch (e) {
					logger.error(`Failed to unpatch ${name}.`, e);
				}
			},
		};
		object.__ittaiPatches__.push(patchData);

		if (object[functionName].__ittaiPatched__) return patchData;

		const props = { ...object[functionName] };

		object[functionName] = function (...args) {
			const functionPatches = object.__ittaiPatches__.filter(
				(p) => p.functionName === functionName
			);
			const befores = functionPatches.filter((p) => p.type === "before");
			const insteads = functionPatches.filter((p) => p.type === "instead");
			const afters = functionPatches.filter((p) => p.type === "after");

			// Before patches.
			for (const before of befores) {
				try {
					args = before.patch(args);
				} catch (e) {
					logger.error(`Error running before patch ${name}.`, e);
				}
			}

			// Instead patches.
			let res = {};
			if (insteads.length === 0) {
				try {
					res = patchData.original.call(this, ...args);
				} catch (e) {
					logger.error(`Error running instead patch ${name}.`, e);
				}
			} else {
				// Bad, fix later.
				for (const instead of insteads) {
					// Do trash merge with Lodash.
					try {
						res = globalThis._.merge(res, instead.patch(args));
					} catch (e) {
						logger.error(`Error running instead patch ${name}.`, e);
					}
				}
			}

			// After patches.
			for (const after of afters) {
				try {
					res = after.patch(args, res);
				} catch (e) {
					logger.error(`Error running after patch ${name}.`, e);
				}
			}

			return res;
		};

		for (const key in props) {
			object[functionName][key] = props[key];
		}

		object[functionName].__ittaiPatched__ = true;

		return patchData;
	},
};
