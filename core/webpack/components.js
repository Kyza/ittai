import { updateModules } from "./modules";

let _components = {};
updateComponents();

export function getAllComponentsFromModule(module) {
	let components = {};
	if (typeof module === "function" && module.hasOwnProperty("displayName")) return components[module.displayName] = module;
	for (const prop of [...Object.values(module), ...(module.type ? Object.values(module.type) : [])]) {
		if (prop ?? false && prop.hasOwnProperty("displayName")) {
			components[prop.displayName] = prop;
		}
	}
	return components;
}

const componentsHandler = {
	get: function (target, prop, receiver) {
		if (!target.hasOwnProperty(prop)) {
			return updateComponents()[prop];
		}
		return Reflect.get(...arguments);
	},
};

export function updateComponents() {
	let components = {};

	for (const mod of updateModules()) {
		Object.assign(components, getAllComponentsFromModule(mod));
	}

	return (_components = components);
}

export const all = new Proxy(_components, componentsHandler);
