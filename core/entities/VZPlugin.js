import { React } from "../webpack";

export default class Plugin extends require("@vizality/entities").Plugin {
	setSettingsPanel(component) {
		if (typeof component === "function")
			component = React.createElement(component);
		vizality.api.settings.registerAddonSettings({
			id: this.addonId,
			render: () => component,
		});
	}
	removeSettingsPanel() {
		vizality.api.settings.unregisterAddonSettings(this.addonId);
	}
}
