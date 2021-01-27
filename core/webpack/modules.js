/**
 * @module webpack/modules
 */

const webpackID = "_ittai";
let _modules;
let webpackCache;
updateModules();

/**
 * Gets a Webpack module from Discord by its property names.
 * @param  {...string} names
 * @returns {Object}
 * @example
 * ittai.webpack.modules.getByProps("useState", "useRef");
 */
export function getByProps(...props) {
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
/**
 * Gets a Webpack module from Discord by its display name.
 * @param  {string} displayName
 * @returns {Object}
 * @example
 * ittai.webpack.modules.getByDisplayName("CallTile");
 */
export function getByDisplayName(displayName) {
	for (const mod of all()) {
		if (
			mod.displayName === displayName ||
			(mod.default && mod.default.displayName === displayName) ||
			(mod.type && mod.type.displayName === displayName) ||
			(mod.type &&
				mod.type.default &&
				mod.type.default.displayName === displayName)
		) {
			return mod;
		}
	}
	return null;
}

/**
 * Gets all modules in Discord's Webpack modules.
 * @returns {Object} The module cache.
 */
export function all() {
	if (_modules) return _modules;
	return updateModules();
}

/**
 * Updates the module cache.
 * @returns {Object} The module cache.
 */
export function updateModules() {
	if (!webpackCache) {
		let __webpack_require__ = globalThis.webpackJsonp.push([
			[],
			{
				[webpackID]: (module, exports, __webpack_require__) =>
					(module.exports = __webpack_require__),
			},
			[[webpackID]],
		]);
		delete __webpack_require__.m[webpackID];
		delete __webpack_require__.c[webpackID];
		webpackCache = __webpack_require__.c;
		cleanWebpackJsonp();
	}

	return (_modules = Object.keys(webpackCache)
		.map((m) => webpackCache[m].exports)
		.filter(
			(m) => ["object", "function"].indexOf(typeof m) !== -1 && m !== globalThis
		));
}

/**
 * Removes Ittai from `webpackJsonp`.
 */
export function cleanWebpackJsonp() {
	for (let i = globalThis.webpackJsonp.length - 1; i >= 0; i--) {
		if (!globalThis.webpackJsonp.hasOwnProperty(i)) continue;
		if (
			globalThis.webpackJsonp[i][2] &&
			globalThis.webpackJsonp[i][2][0] == webpackID
		) {
			globalThis.webpackJsonp.splice(i, 1);
			i += 1;
		}
	}
}
