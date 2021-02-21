import { wrapFilter, all } from "../modules";

export default /**
 * Gets a Webpack module from Discord by a filter.
 * @memberof module:webpack/modules
 * @param {function} filter
 * @returns {Object}
 * @example
 * ittai.webpack.modules.getByFilter((m) => m?.default?.displayName === "Text");
 */ function getByFilter(filter) {
	filter = wrapFilter(filter);
	for (const mod of all()) {
		if (filter(mod)) {
			return mod;
		} else if (mod.default && filter(mod.default)) {
			return mod.default;
		}
	}
	return null;
}
