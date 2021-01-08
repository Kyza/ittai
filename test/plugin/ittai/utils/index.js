import getClientMod from "./getClientMod";

export * as patcher from "./patcher";
export * as logger from "./logger";

// Know it will work on this client mod or it's detecting the wrong one?
// Set this variable.
let clientMod;

export function getClientMod() {
	if (clientMod) return clientMod;
	if (globalThis.BdApi) {
		return (clientMod = "betterdiscord");
	} else if (globalThis.EdApi) {
		return (clientMod = "enhanceddiscord");
	} else if (globalThis.powercord) {
		return (clientMod = "powercord");
	} else if (globalThis.vizality) {
		return (clientMod = "vizality");
	} else if (globalThis.untitled) {
		throw Error("Untitled is not supported yet.");
	} else if (globalThis.nxt) {
		throw Error("How the hell did you get this client mod.");
	}
	throw Error("Unknown client mod.");
}
