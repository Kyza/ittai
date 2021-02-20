import { _classes, updateClasses } from "../classes";

/**
 * Gets all classes in Discord's Webpack modules.
 * @returns {Object} The class cache.
 */
export default function all() {
	if (_classes) return _classes;
	return updateClasses();
}
