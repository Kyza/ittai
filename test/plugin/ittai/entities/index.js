import { getClientMod } from "../utils";

export default {
	get Plugin() {
		switch (getClientMod()) {
			case "powercord":
				return require("powercord/entities").Plugin;
			case "vizality":
				return require("@vizality/core").Plugin;
			default:
				return class Plugin {
					log() {
						console.log(...arguments);
					}
					debug() {
						console.debug(...arguments);
					}
					warn() {
						console.warn(...arguments);
					}
					error() {
						console.error(...arguments);
					}
				};
		}
	},
};
