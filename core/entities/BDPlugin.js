import * as logger from "../logger";
import { React, ReactDOM } from "../libraries";
import { modules, components } from "../webpack";

const LayerProvider = components.all.AppLayerProvider().props.layerContext
	.Provider;
const AccessibilityProvider = modules.getByProps(
	"AccessibilityPreferencesContext"
).AccessibilityPreferencesContext.Provider;

const layerClass = modules.getByProps("LayerClassName").LayerClassName;

export default class Plugin {
	settings = {
		get: (key, defaultValue) => {
			return (
				this.settings.all()[key] ??
				(this.settings.set({ [key]: defaultValue }), defaultValue)
			);
		},
		all: () => {
			return BdApi.loadData(this.constructor.name, "settings") ?? {};
		},
		set: (newSettings) => {
			if (typeof newSettings !== "object") return;
			BdApi.saveData(
				this.constructor.name,
				"settings",
				Object.assign(this.settings.all(), newSettings)
			);
		},
		setPanel: (component) => {
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
		},
		removePanel: () => {
			delete this.getSettingsPanel;
		},
	};

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
}
