import { getClientMod } from "../utils";

export default {
	getModule(...args) {
		console.log(getClientMod());
		switch (getClientMod()) {
			case "powercord":
				return require("powercord/webpack").getModule(args, false);
			case "vizality":
				return require("@vizality/webpack").getModule(...args);
		}
	},
};
