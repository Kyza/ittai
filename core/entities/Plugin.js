import { log, debug, warn, error } from "../logger";
import { React, ReactDOM } from "../webpack/common";
import { DiscordProviders } from "../components";
import { modules, components } from "../webpack";
import { getClientMod } from "../utilities";

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

	settings = {
		get: (key, defaultValue) => {
			switch (getClientMod()) {
				case "betterdiscord":
					return (
						this.settings.all()[key] ??
						(this.settings.set({ [key]: defaultValue }), defaultValue)
					);
				default:
					break;
			}
		},
		all: () => {
			switch (getClientMod()) {
				case "betterdiscord":
					return BdApi.loadData(this.constructor.name, "settings") ?? {};
				default:
					break;
			}
		},
		set: (newSettings) => {
			switch (getClientMod()) {
				case "betterdiscord":
					if (typeof newSettings !== "object") return;
					BdApi.saveData(
						this.constructor.name,
						"settings",
						Object.assign(this.settings.all(), newSettings)
					);
				default:
					break;
			}
		},
		setPanel: (component) => {
			switch (getClientMod()) {
				case "betterdiscord":
					this.getSettingsPanel = makeBDSettingsPanel(component);
				default:
					break;
			}
		},
		removePanel: () => {
			switch (getClientMod()) {
				case "betterdiscord":
					delete this.getSettingsPanel;
					break;
				default:
					break;
			}
		},
	};

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

function makeBDSettingsPanel(component) {
	return () => {
		if (typeof component === "function")
			component = React.createElement(component);
		const container = document.createElement("div");
		try {
			return <DiscordProviders>{component}</DiscordProviders>;
		} catch (e) {
			this.error("Failed to load settings panel.", e);
		}
		return null;
	};
}
