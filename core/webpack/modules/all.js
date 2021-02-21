import { _modules, updateModules } from "../modules";

export default /**
 * Gets all modules in Discord's Webpack modules.
 * @memberof module:webpack/modules
 * @returns {Object} The module cache.
 */ function all() {
	if (_modules) return _modules;
	return updateModules();
}
