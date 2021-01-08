import Logger from "../utils/logger";
import { getClientMod } from "../utils";

export default {
	/**
	 * Get the Plugin class.
	 *
	 * @return {class} Plugin class.
	 */
	get Plugin() {
		switch (getClientMod()) {
			case "powercord":
				return require("powercord/entities").Plugin;
			case "vizality":
				return require("@vizality/core").Plugin;
			default:
				return class Plugin {
					log() {
						Logger.log(...arguments);
					}
					debug() {
						Logger.debug(...arguments);
					}
					warn() {
						Logger.warn(...arguments);
					}
					error() {
						Logger.error(...arguments);
					}
				};
		}
	},
};
