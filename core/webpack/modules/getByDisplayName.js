import { all } from "../modules";

export default /**
 * Gets a Webpack module from Discord by its display name.
 * @memberof module:webpack/modules
 * @param {string} displayName
 * @returns {Object}
 * @example
 * ittai.webpack.modules.getByDisplayName("CallTile");
 */ function getByDisplayName(displayName) {
	for (const mod of all()) {
		if (
			mod.displayName === displayName ||
			(mod.default && mod.default.displayName === displayName) ||
			(mod.type && mod.type.displayName === displayName) ||
			(mod.type &&
				mod.type.default &&
				mod.type.default.displayName === displayName)
		) {
			return mod;
		}
	}
	return null;
}
