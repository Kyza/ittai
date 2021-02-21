import { _classes, updateClasses } from "../classes";

export default /**
 * Gets all classes in Discord's Webpack modules.
 * @memberof module:webpack/classes
 * @returns {Object} The class cache.
 */ function all() {
	if (_classes.length > 0) return _classes;
	return updateClasses();
}
