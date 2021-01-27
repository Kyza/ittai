/**
 * @module classes
 * @category webpack
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
				new RegExp(`${prop.key}-([a-z]|[A-Z]|\\d){6}`, "gi").test(prop.value)
			) {
				classes[prop.key] = prop.value;
			}
		} catch {}
	}
	return classes;
}

/**
 * Gets a Webpack module from Discord by the class names.
 * @param  {...string} names
 * @returns {Object}
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
