import { log, debug, warn, error } from "../logger";
import { getClientMod } from "../utilities";
import SettingsAPI from "ittai/settings";

export default /**
 * The plugin class for the running client mod.
 * @name Plugin
 * @memberof module:entities
 */ class Plugin extends (() => {
	switch (getClientMod()) {
		case "powercordv2":
			return require("powercord/entities");
		case "vizality":
			return require("@vizality/entities");
		default:
			return class Plugin {};
	}
})() {
	start() {}
	stop() {}
	startPlugin() {
		return this.start();
	}
	pluginWillUnload() {
		return this.stop();
	}

	settings = new SettingsAPI(this);

	log(...args) {
		log(...args);
	}
	debug(...args) {
		debug(...args);
	}
	warn(...args) {
		warn(...args);
	}
	error(...args) {
		error(...args);
	}
}
