import getClientMod from "./getClientMod";

export * as patcher from "./patcher";
export * as logger from "./logger";

// Know it will work on this client mod or it's detecting the wrong one?
// Set this variable.
let clientMod;

export function getClientMod() {
	if (clientMod) return clientMod;
	if (globalThis.BdApi && !window.powercord?.pluginManager.get("bdCompat")) {
		return (clientMod = "betterdiscord");
	} else if (globalThis.powercord) {
		return (clientMod = "powercordv2");
	} else if (globalThis.vizality) {
		return (clientMod = "vizality");
	} else if (globalThis.Untitled) {
		throw Error("Untitled is not supported yet.");
	} else if (globalThis.nxt) {
		throw Error("How the hell did you get this client mod.");
	}
	throw Error("Unknown client mod.");
}
