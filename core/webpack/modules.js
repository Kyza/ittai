const webpackID = "_ittai";
let _modules;
let webpackCache;
updateModules();

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

export function all() {
	if (_modules) return _modules;
	return updateModules();
}

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
