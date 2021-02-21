import { patches } from "../patcher";

export default /**
 * Unpatches all of the patches specified, or all of them if none are specified.
 * @memberof module:patcher
 * @param {string[]} [unpatches={@link module:patcher.patches}] An array patch names.
 */ function unpatchAll(unpatches) {
	if (!Array.isArray(unpatches)) unpatches = patches;
	for (const object of Object.values(unpatches)) {
		for (const funct of Object.values(object)) {
			for (const patch of funct.patches) {
				patch.unpatch();
			}
		}
	}
}
