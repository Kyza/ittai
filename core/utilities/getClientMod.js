// Know it will work on this client mod or it's detecting the wrong one?
// Set this variable.
let clientMod;

export default /**
 * @memberof module:utilities
 * @returns {string} The name of the running client mod.
 */ function getClientMod() {
	if (clientMod) return clientMod;
	if (
		globalThis.BdApi &&
		!globalThis.powercord?.pluginManager.get("bdCompat")
	) {
		return (clientMod = "betterdiscord");
	} else if (globalThis.powercord) {
		return (clientMod = "powercordv2");
	} else if (globalThis.vizality) {
		return (clientMod = "vizality");
	} else if (globalThis.Untitled) {
		throw Error("Untitled is not supported yet.");
	}
	throw Error("Unknown client mod.");
}
