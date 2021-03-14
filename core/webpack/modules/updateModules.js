import {
	_modules,
	webpackCache,
	webpackID,
	cleanWebpackJsonp,
	wpr,
} from "../modules";

export default /**
 * Updates the module cache.
 * @memberof module:webpack/modules
 * @returns {Object} The module cache.
 */ function updateModules() {
	if (!webpackCache) {
		wpr = globalThis.webpackJsonp.push([
			[],
			{
				[webpackID]: (module, exports, __webpack_require__) =>
					(module.exports = __webpack_require__),
			},
			[[webpackID]],
		]);
		delete wpr.m[webpackID];
		delete wpr.c[webpackID];
		webpackCache = wpr.c;
		cleanWebpackJsonp();
	}

	return (_modules = Object.keys(webpackCache)
		.map((m) => webpackCache[m].exports)
		.filter(
			(m) => ["object", "function"].indexOf(typeof m) !== -1 && m !== globalThis
		));
}
