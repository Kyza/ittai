import { getClientMod, logger } from "../utils";
import { React, ReactDOM } from "../webpack";

export const Plugin = (() => {
	switch (getClientMod()) {
		case "powercordv2":
			return require("./PCv2Plugin");
		case "vizality":
			return require("./VZPlugin");
		case "betterdiscord":
			return require("./BDPlugin");
	}
})();
