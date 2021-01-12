import logger from "./logger";

export let patches = [];

export function before(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "before", patchFunction);
}
export function instead(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "instead", patchFunction);
}
export function after(name, object, functionName, patchFunction) {
	return patch(name, object, functionName, "after", patchFunction);
}

export function unpatchAll(ps) {
	if (!ps) ps = patches;
	else if (!Array.isArray(ps)) throw "`patches` is not an array.";

	for (const patch of ps) {
		patch.unpatch();
	}
}

export function patch(name, object, functionName, type, patchFunction) {
	if (!object.__ittai__) object.__ittai__ = {};
	const patchData = {
		name,
		type,
		patchFunction,
		unpatch: function () {
			try {
				const patchIndex = object.__ittai__[functionName].patches.indexOf(this);
				if (patchIndex === -1)
					throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
				// Restore original function.
				object[functionName] = object.__ittai__[functionName].original;
				// Delete patch.
				object.__ittai__[functionName].patches.splice(patchIndex, 1);
				patches.splice(patchIndex, 1);
				// Clean up the object if there are no patches left.
				if (!object.__ittai__[functionName].patches.length) {
					delete object.__ittai__[functionName];
				}
				if (!Object.keys(object.__ittai__).length) {
					delete object.__ittai__;
				}
			} catch (e) {
				logger.error(`Failed to unpatch ${name}.`, e);
			}
		},
	};

	if (!object.__ittai__[functionName]) {
		object.__ittai__[functionName] = {
			original: { ...object }[functionName],
			patches: [],
		};

		const props = { ...object[functionName] };

		object[functionName] = function (...args) {
			const functionData = object.__ittai__[functionName];
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
			object.__ittai__[functionName].original.toString();
	}
	object.__ittai__[functionName].patches.push(patchData);
	patches.push(patchData);

	return patchData;
}
