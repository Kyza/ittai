import { _components, updateComponents } from "../components";

export default {
	get: function (target, prop, receiver) {
		if (prop === "length") return Object.keys(_components).length;
		if (!target.hasOwnProperty(prop)) {
			return updateComponents()[prop];
		}
		return Reflect.get(...arguments);
	},
};
