import { updateModules } from "./modules";

let _components = {};
updateComponents();

export function getAllComponentsFromModule(module) {
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

const componentsHandler = {
	get: function (target, prop, receiver) {
		if (prop === "length") return Object.keys(_components).length;
		if (!target.hasOwnProperty(prop)) {
			return updateComponents()[prop];
		}
		return Reflect.get(...arguments);
	},
};

export function updateComponents() {
	let components = {};

	for (const mod of updateModules()) {
		const newComponents = getAllComponentsFromModule(mod);
		for (const comp of Object.keys(newComponents).map((c) => ({
			key: c,
			value: newComponents[c],
		}))) {
			while (components[comp.key] && components[comp.key] !== comp.value) {
				comp.key = comp.key + "_";
			}
			components[comp.key] = comp.value;
		}
	}

	return (_components = components);
}

export const all = new Proxy(_components, componentsHandler);
