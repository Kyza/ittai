import { all } from "../modules";

export default /**
 * Gets a Webpack module from Discord by its property names.
 * @memberof module:webpack/modules
 * @param {...string} names
 * @returns {Object}
 * @example
 * ittai.webpack.modules.getByProps("useState", "useRef");
 */ function getByProps(...props) {
	for (const mod of all()) {
		if (props.every((prop) => mod[prop] !== undefined)) {
			return mod;
		} else if (
			mod.default &&
			props.every((prop) => mod.default[prop] !== undefined)
		) {
			return mod.default;
		}
	}
	return null;
}
