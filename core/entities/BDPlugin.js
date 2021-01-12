import { logger } from "../utils";
import { React, ReactDOM, getModule } from "../webpack";

const LayerProvider = getModule("AppReferencePositionLayer").AppLayerProvider()
	.props.layerContext.Provider;
const AccessibilityProvider = getModule("AccessibilityPreferencesContext")
	.AccessibilityPreferencesContext.Provider;

const layerClass = getModule("LayerClassName").LayerClassName;

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
