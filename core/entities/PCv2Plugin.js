import { React } from "../webpack";

export default class Plugin extends require("powercord/entities").Plugin {
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

	setSettingsPanel(component) {
		if (typeof component === "function")
			component = React.createElement(component);
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: _.startCase(this.constructor.name),
			render: () => component,
		});
	}
	removeSettingsPanel() {
		powercord.api.settings.unregisterSettings(this.entityID);
	}
}
