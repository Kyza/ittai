import { getClientMod } from "../utils";

export default {
	get Plugin() {
		switch (getClientMod()) {
			case "powercord":
				return require("powercord/entities").Plugin;
			case "vizality":
				return require("@vizality/core").Plugin;
			default:
				return class Plugin {};
		}
	},
};
