import { getClientMod } from "../utilities";
import {
	React,
	ReactDOM,
	Lodash,
	Flux,
	FluxDispatcher,
} from "../webpack/common";
import { DiscordProviders, FluxWrapper } from "../components";
import { log, error } from "../logger";

let settings = {};
let pluginInstance;

class SettingsStore extends Flux.Store {
	constructor(Dispatcher, handlers) {
		super(Dispatcher, handlers);

		settings = (() => {
			this.getSettings();
		})();
	}

	getSettings() {
		switch (getClientMod()) {
			case "betterdiscord":
				return (
					BdApi.loadData(pluginInstance.constructor.name, "settings") ?? {}
				);
			default:
				return {};
		}
	}

	getSetting(keyPath, defaultValue) {
		return Lodash.get(this.getSettings(), keyPath, defaultValue);
	}

	save() {
		log("Saving settings.");
		switch (getClientMod()) {
			case "betterdiscord":
				BdApi.saveData(
					pluginInstance.constructor.name,
					"settings",
					this.getSettings()
				);
			default:
				break;
		}
	}
}

class SettingsAPI {
	constructor(plugin) {
		pluginInstance = plugin;
		this.actions = {
			UPDATE_SETTINGS: `${plugin.constructor.name}_UPDATE_SETTINGS`,
			UPDATE_SETTING: `${plugin.constructor.name}_UPDATE_SETTING`,
		};
		this.store = new SettingsStore(FluxDispatcher, {
			[this.actions.UPDATE_SETTINGS]: this._updateSettings,
			[this.actions.UPDATE_SETTING]: this._updateSetting,
		});
	}

	cleanup() {
		this.unregister();
		this.removePanel();
	}

	unregister() {
		FluxDispatcher._dependencyGraph.removeNode(this.store._dispatchToken);
	}

	_updateSettings = ({ value }) => {
		Object.assign(settings, value);
		this.store.save();
	};

	_updateSetting = ({ keyPath, value }) => {
		Lodash.set(settings, keyPath, value);
		this.store.save();
	};

	connectStore(Component) {
		return (
			<FluxWrapper
				stores={{ store: this.store }}
				createProps={() => ({
					getAll: () => this.getAll(),
					get: (keyPath, defaultValue) =>
						this.store.getSetting(keyPath, defaultValue),
					setAll: (value) => this.setAll(value),
					set: (keyPath, value) => this.set(keyPath, value),
				})}
			>
				{Component}
			</FluxWrapper>
		);
	}

	getAll() {
		return this.store.getSettings();
	}
	get(keyPath, defaultValue) {
		return this.store.getSetting(keyPath, defaultValue);
	}
	setAll(value) {
		return FluxDispatcher.dirtyDispatch({
			type: this.actions.UPDATE_SETTINGS,
			value,
		});
	}
	set(keyPath, value) {
		return FluxDispatcher.dirtyDispatch({
			type: this.actions.UPDATE_SETTING,
			keyPath,
			value,
		});
	}
	// this.set = (newSettings) => {
	// 	FluxDispatcher.dirtyDispatch({ type: "SET", value: newSettings });
	// };
	setPanel(Component) {
		switch (getClientMod()) {
			case "betterdiscord":
				pluginInstance.getSettingsPanel = this.makeBDSettingsPanel(
					this.connectStore(Component)
				);
			default:
				break;
		}
	}
	removePanel() {
		switch (getClientMod()) {
			case "betterdiscord":
				delete pluginInstance.getSettingsPanel;
				break;
			default:
				break;
		}
	}

	/** @private */
	makeBDSettingsPanel(CreatedComponent) {
		const container = document.createElement("div");
		return () => {
			try {
				return (
					ReactDOM.render(
						<DiscordProviders>{CreatedComponent}</DiscordProviders>,
						container
					),
					container
				);
			} catch (e) {
				error("Failed to load settings panel.", e);
			}
			return null;
		};
	}
}

export default SettingsAPI;
