import logger from "./logger";

export default {
	patch: function (name, object, functionName, type, patch) {
		if (!object.__ittai__) object.__ittai__ = {};
		const patchData = {
			name,
			type,
			patch,
			unpatch: function () {
				try {
					const patchIndex = object.__ittai__[functionName].patches.indexOf(
						this
					);
					if (patchIndex === -1)
						throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
					// Restore original function.
					object[functionName] = object.__ittai__[functionName].original;
					// Delete patch.
					object.__ittai__[functionName].patches.splice(patchIndex, 1);
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
				const insteads = functionData.patches.filter(
					(p) => p.type === "instead"
				);
				const afters = functionData.patches.filter((p) => p.type === "after");

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
					res = functionData.original.call(this, ...args);
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
		}
		object.__ittai__[functionName].patches.push(patchData);

		return patchData;
	},
};
