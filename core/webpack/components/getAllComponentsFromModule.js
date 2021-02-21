export default /**
 * Extracts all of the React components from a Webpack module.
 * @memberof module:webpack/components
 * @param {Object} module The module to search.
 */ function getAllComponentsFromModule(module) {
	let components = {};
	if (typeof module === "function" && module.displayName != undefined)
		return (components[module.displayName] = module);
	for (const prop of [
		...Object.values(module),
		...(module.type ? Object.values(module.type) : []),
		...(module.default ? Object.values(module.default) : []),
		...(module.type && module.type.default
			? Object.values(module.type.default)
			: []),
	]) {
		if (prop && prop.displayName != undefined) {
			components[prop.displayName] = prop;
		}
	}
	return components;
}
