import { all } from "../classes";

export default /**
 * Gets a Webpack module from Discord by the class names.
 * @param  {...string} names The names of the classes.
 * @returns {Object}
 * @memberof module:webpack/classes
 * @example
 * ittai.webpack.classes.getByNames("message", "cozyMessage");
 */ function getByNames(...names) {
	for (const mod of all()) {
		if (names.every((name) => mod[name] !== undefined)) {
			return mod;
		}
	}

	return null;
}
