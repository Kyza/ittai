import { logger } from "../utils";
import { React, ReactDOM } from "../libraries";
import { modules } from "../webpack";
import { all as components } from "../webpack/components";

const LayerProvider = components.AppLayerProvider().props.layerContext.Provider;
const AccessibilityProvider = modules.getByProps(
	"AccessibilityPreferencesContext"
).AccessibilityPreferencesContext.Provider;

const layerClass = modules.getByProps("LayerClassName").LayerClassName;

export default class Plugin {
	getSettings() {
		return BdApi.loadData(this.constructor.name, "settings") ?? {};
	}
	getSetting(key, defaultValue) {
		return this.getSettings()[key] ?? { [key]: defaultValue };
	}
	setSettings(newSettings) {
		if (typeof newSettings !== "object") return;
		BdApi.saveData(
			this.constructor.name,
			"settings",
			Object.assign(this.getSettings(), newSettings)
		);
	}
	setSetting(key, value) {
		BdApi.saveData(
			this.constructor.name,
			"settings",
			Object.assign(this.getSettings(), { [key]: value })
		);
	}

	log() {
		logger.log(...arguments);
	}
	debug() {
		logger.debug(...arguments);
	}
	warn() {
		logger.warn(...arguments);
	}
	error() {
		logger.error(...arguments);
	}
	setSettingsPanel(component) {
		this.getSettingsPanel = () => {
			if (typeof component === "function")
				component = React.createElement(component);
			const container = document.createElement("div");
			try {
				return (
					ReactDOM.render(
						React.createElement(
							AccessibilityProvider,
							{
								value: {
									reducedMotion: {
										enabled: false,
										rawValue: "no-preference",
									},
								},
							},
							React.createElement(
								LayerProvider,
								{
									value: [
										document.querySelector(`#app-mount > .${layerClass}`),
									],
								},
								component
							)
						),
						container
					),
					container
				);
			} catch (e) {
				this.error("Failed to load settings panel.", e);
			}
			return null;
		};
	}
	removeSettingsPanel() {
		delete this.getSettingsPanel;
	}
}