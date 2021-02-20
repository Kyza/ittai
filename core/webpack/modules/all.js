import { _modules, updateModules } from "../modules";

/**
 * Gets all modules in Discord's Webpack modules.
 * @returns {Object} The module cache.
 */
export default function all() {
	if (_modules) return _modules;
	return updateModules();
}
