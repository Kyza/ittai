/**
 * @module webpack/classes
 */

import { updateModules } from "./modules";

let _classes = [];
updateClasses();

/**
 * Extracts all of the classes from a Webpack module.
 * @param {Object} module The module to search.
 */
export function getAllClassesFromModule(module) {
	let classes = {};
	for (const prop of Object.keys(module).map((key) => ({
		key,
		value: module[key],
	}))) {
		try {
			if (
				typeof prop.value === "string" &&
				new RegExp(`${prop.key}-.+`, "gi").test(prop.value)
			) {
				classes[prop.key] = prop.value;
			}
		} catch {}
	}
	return classes;
}

/**
 * Gets a Webpack module from Discord by the class names.
 * @param  {...string} names The names of the classes.
 * @returns {Object}
 * @example
 * ittai.webpack.classes.getByNames("message", "cozyMessage");
 */
export function getByNames(...names) {
	for (const mod of all()) {
		if (names.every((name) => mod[name] !== undefined)) {
			return mod;
		}
	}

	return null;
}

/**
 * Updates the class cache.
 * @returns {Object} The class cache.
 */
export function updateClasses() {
	let classes = [];

	for (const mod of updateModules()) {
		const newClasses = getAllClassesFromModule(mod);
		if (Object.keys(newClasses).length) classes.push(newClasses);
	}

	return (_classes = classes);
}

/**
 * Gets all classes in Discord's Webpack modules.
 * @returns {Object} The class cache.
 */
export function all() {
	if (_classes) return _classes;
	return updateClasses();
}
