import { getClientMod } from "../utils";

export const React = getModule("useState");
export const ReactDOM = getModule("render", "unmountComponentAtNode");

export function getModule(...args) {
	switch (getClientMod()) {
		case "powercordv2":
			return require("powercord/webpack").getModule(args, false);
		case "vizality":
			return require("@vizality/webpack").getModule(...args);
		case "betterdiscord":
			if (typeof args[0] === "function") {
				return BdApi.findModule(args[0]);
			}
			return BdApi.findModuleByProps(...args);
	}
}
export function getModuleByDisplayName(args) {
	switch (getClientMod()) {
		case "powercordv2":
			return require("powercord/webpack").getModuleByDisplayName(args, false);
		case "vizality":
			return require("@vizality/webpack").getModuleByDisplayName(args);
		case "betterdiscord":
			return BdApi.findModuleByDisplayName(args);
	}
}
