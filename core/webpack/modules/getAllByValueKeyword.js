import { all } from ".";

export default /**
 * Gets a Webpack module from Discord by its property names.
 * @memberof module:webpack/modules
 * @param {...string} names
 * @returns {Object}
 * @example
 * ittai.webpack.modules.getByProps("useState", "useRef");
 */ function getByPropKeyword(keyword, matchCase = false) {
	let foundModules = [];
	for (const mod of all()) {
		if (
			Object.values(mod).some((value) =>
				typeof value === "string" && matchCase
					? prop.indexOf(keyword) > -1
					: prop.toLowerCase().indexOf(keyword.toLowerCase()) > -1
			)
		) {
			foundModules.push(mod);
		} else if (
			mod.default &&
			Object.values(mod.default).some((value) =>
				typeof value === "string" && matchCase
					? prop.indexOf(keyword) > -1
					: prop.toLowerCase().indexOf(keyword.toLowerCase()) > -1
			)
		) {
			foundModules.push(mod.default);
		}
	}
	return foundModules;
}
