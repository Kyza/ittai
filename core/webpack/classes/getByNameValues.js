import { all } from "../classes";

export default /**
 * Gets a Webpack module from Discord by the class name values.
 * @param  {...string} nameValues The values of the class names.
 * @returns {Object}
 * @memberof module:webpack/classes
 * @example
 * ittai.webpack.classes.getByNameValues("message", "cozyMessage");
 */ function getByNameValues(...nameValues) {
	for (const mod of all()) {
		if (nameValues.every((value) => mod[value.split("-")[0]] == value)) {
			return mod;
		}
	}

	return null;
}
