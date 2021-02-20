import { all } from "../classes";

/**
 * Gets a Webpack module from Discord by the class name values.
 * @param  {...string} nameValues The values of the class names.
 * @returns {Object}
 * @example
 * ittai.webpack.classes.getByNameValues("message", "cozyMessage");
 */
export default function getByNameValues(...nameValues) {
	for (const mod of all()) {
		if (names.every((name) => mod[name] !== undefined)) {
			return mod;
		}
	}

	return null;
}
