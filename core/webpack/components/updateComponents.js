import { updateModules } from "../modules";
import { _components, getAllComponentsFromModule } from "../components";

export default /**
 * Updates the React component cache.
 * @memberof module:webpack/components
 * @returns {Object} The React component cache.
 */ function updateComponents() {
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
