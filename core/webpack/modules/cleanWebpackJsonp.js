import { webpackID } from "../modules";

export default /**
 * Removes Ittai from `webpackJsonp`.
 * @memberof module:webpack/modules
 */ function cleanWebpackJsonp() {
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
