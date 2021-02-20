import { updateModules } from "../modules";
import { _classes, getAllClassesFromModule } from "../classes";

/**
 * Updates the class cache.
 * @returns {Object} The class cache.
 */
export default function updateClasses() {
	let classes = [];

	for (const mod of updateModules()) {
		const newClasses = getAllClassesFromModule(mod);
		if (Object.keys(newClasses).length) classes.push(newClasses);
	}

	return (_classes = classes);
}
