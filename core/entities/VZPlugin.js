import { React } from "../libraries";

export default class Plugin extends require("@vizality/entities").Plugin {
	setSettingsPanel(component) {
		if (typeof component === "function")
			component = React.createElement(component);
		this.registerSettings(component);
	}
	removeSettingsPanel() {}
}
