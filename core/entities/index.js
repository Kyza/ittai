/**
 * @module entities
 */

import { getClientMod, patcher } from "../utils";

const faURL =
	"https://kit-pro.fontawesome.com/releases/v5.15.1/css/pro.min.css";

/**
 * The plugin class for the running client mod.
 */
export const Plugin = (() => {
	if (!document.querySelector(`[href="${faURL}"]`)) {
		document.head.appendChild(
			Object.assign(document.createElement("link"), {
				rel: "stylesheet",
				href: faURL,
			})
		);
	}

	let pluginEntity;
	switch (getClientMod()) {
		case "powercordv2":
			pluginEntity = require("./PCv2Plugin");
		case "vizality":
			pluginEntity = require("./VZPlugin");
		case "betterdiscord":
			pluginEntity = require("./BDPlugin");
	}

	// Unpatch all.
	const oldStop = { ...pluginEntity }.stop;
	pluginEntity.stop = () => {
		oldStop();
		patcher.unpatchAll();
	};
})();
