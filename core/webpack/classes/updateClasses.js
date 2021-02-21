import { updateModules } from "../modules";
import { _classes, getAllClassesFromModule } from "../classes";

export default /**
 * Updates the class cache.
 * @memberof module:webpack/classes
 * @returns {Object} The class cache.
 */ function updateClasses() {
	let classes = [];

	for (const mod of updateModules()) {
		const newClasses = getAllClassesFromModule(mod);
		if (Object.keys(newClasses).length) classes.push(newClasses);
	}

	return (_classes = classes);
}
