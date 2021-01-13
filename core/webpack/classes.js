import { updateModules } from "./modules";

let _classes = [];
updateClasses();

export function getAllClassesFromModule(module) {
	let classes = {};
	for (const prop of Object.keys(module).map((key) => ({
		key,
		value: module[key],
	}))) {
		try {
			if (
				typeof prop.value === "string" &&
				new RegExp(`${prop.key}-([a-z]|[A-Z]|\\d){6}`, "gi").test(prop.value)
			) {
				classes[prop.key] = prop.value;
			}
		} catch {}
	}
	return classes;
}

export function getByNames(...names) {
	for (const mod of all()) {
		if (names.every((name) => mod[name] !== undefined)) {
			return mod;
		}
	}

	return null;
}

export function updateClasses() {
	let classes = [];

	for (const mod of updateModules()) {
		const newClasses = getAllClassesFromModule(mod);
		if (Object.keys(newClasses).length) classes.push(newClasses);
	}

	return (_classes = classes);
}

export function all() {
	if (_classes) return _classes;
	return updateClasses();
}
