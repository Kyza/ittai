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

	switch (getClientMod()) {
		case "powercordv2":
			return require("./PCv2Plugin");
		case "vizality":
			return require("./VZPlugin");
		case "betterdiscord":
			return require("./BDPlugin");
	}
})();
