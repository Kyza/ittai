import { getClientMod } from "../utils";

export default {
	getModule(...args) {
		switch (getClientMod()) {
			case "powercord":
				return require("powercord/webpack").getModule(args, false);
			case "vizality":
				return require("@vizality/webpack").getModule(...args);
			case "betterdiscord":
				if (typeof args[0] === "function") {
					return BdApi.findModule(args[0]);
				}
				return BdApi.findModuleByProps(...args);
		}
	},
	getModuleByDisplayName(args) {
		switch (getClientMod()) {
			case "powercord":
				return require("powercord/webpack").getModuleByDisplayName(args, false);
			case "vizality":
				return require("@vizality/webpack").getModuleByDisplayName(args);
			case "betterdiscord":
				return BdApi.findModuleByDisplayName(args);
		}
	},
};
