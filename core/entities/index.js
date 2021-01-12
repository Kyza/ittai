import { getClientMod, logger } from "../utils";

export const Plugin = (() => {
	switch (getClientMod()) {
		case "powercordv2":
			return class Plugin extends require("powercord/entities").Plugin {
				setSettingsPanel(label, component) {
					powercord.api.settings.registerSettings(this.entityID, {
						category: this.entityID,
						label,
						render: () => component,
					});
				}
				removeSettingsPanel() {
					powercord.api.settings.unregisterSettings(this.entityID);
				}
			};
		case "vizality":
			return class Plugin extends require("@vizality/entities").Plugin {
				setSettingsPanel(label, component) {
					vizality.api.settings.registerAddonSettings({
						id: this.addonId,
						render: () => component,
					});
				}
				removeSettingsPanel() {
					vizality.api.settings.unregisterAddonSettings(this.addonId);
				}
			};
		case "betterdiscord":
			return class Plugin {
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
				setSettingsPanel(label, component) {
					this.getSettingsPanel = () => {
						return component ?? null;
					};
				}
				removeSettingsPanel() {
					delete this.getSettingsPanel;
				}
			};
	}
})();
