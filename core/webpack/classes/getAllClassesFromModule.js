/**
 * Extracts all of the classes from a Webpack module.
 * @param {Object} module The module to search.
 */
export default function getAllClassesFromModule(module) {
	let classes = {};
	for (const prop of Object.keys(module).map((key) => ({
		key,
		value: module[key],
	}))) {
		try {
			if (
				typeof prop.value === "string" &&
				new RegExp(`${prop.key}-.+`, "gi").test(prop.value)
			) {
				classes[prop.key] = prop.value;
			}
		} catch {}
	}
	return classes;
}
