import {
	_modules,
	webpackCache,
	webpackID,
	cleanWebpackJsonp,
} from "../modules";

/**
 * Updates the module cache.
 * @returns {Object} The module cache.
 */
export default function updateModules() {
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
