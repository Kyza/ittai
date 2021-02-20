import { wrapFilter, all } from "../modules";

export default function getByFilter(filter) {
	filter = wrapFilter(filter);
	for (const mod of all()) {
		if (filter(mod)) {
			return mod;
		} else if (mod.default && filter(mod.default)) {
			return mod.default;
		}
	}
	return null;
}
