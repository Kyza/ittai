import logger from "./logger";

function dirtyObject(object) {
	if (!object.__ittaiPatches__) object.__ittaiPatches__ = [];
}

function cleanObject(object) {
	if (object.__ittaiPatches__) delete object.__ittaiPatches__;
}

export default {
	patch: function (object, name, type, patch) {
		dirtyObject(object);
		const patchData = {
			type,
			name,
			patch,
			original: { ...object }[name],
			unpatch: function () {
				try {
					const patchIndex = object.__ittaiPatches__.indexOf(this);
					if (patchIndex === -1)
						throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
					const currentPatch = object.__ittaiPatches__[patchIndex];
					// Restore original function.
					object[name] = currentPatch.original;
					// Delete patch.
					object.__ittaiPatches__.splice(patchIndex, 1);
					// Clean up the object if there are no patches left.
					if (object.__ittaiPatches__.length === 0) cleanObject(object);
				} catch (e) {
					logger.error("Failed to unpatch.", e);
				}
			},
		};
		object.__ittaiPatches__.push(patchData);

		// Test in the morning
		const props = { ...object[name] };

		object[name] = function (...args) {
			const befores = object.__ittaiPatches__.filter(
				(p) => p.type === "before"
			);
			const insteads = object.__ittaiPatches__.filter(
				(p) => p.type === "instead"
			);
			const afters = object.__ittaiPatches__.filter((p) => p.type === "after");

			// Before patches.
			for (const before of befores) {
				try {
					args = before.patch(args);
				} catch (e) {
					logger.error("Error running before patch.", e);
				}
			}

			// Instead patches.
			let res = {};
			if (insteads.length === 0) {
				try {
					res = patchData.original.call(this, ...args);
				} catch (e) {
					logger.error("Error running instead patch.", e);
				}
			} else {
				// Bad, fix later.
				for (const instead of insteads) {
					// Do trash merge with Lodash.
					try {
						res = globalThis._.merge(res, instead.patch(args));
					} catch (e) {
						logger.error("Error running instead patch.", e);
					}
				}
			}

			// After patches.
			for (const after of afters) {
				try {
					res = after.patch(args, res);
				} catch (e) {
					logger.error("Error running after patch.", e);
				}
			}

			return res;
		};

		// Test in the morning
		for (const key in props) {
			object[name][key] = props[key];
		}

		return patchData;
	},
};
