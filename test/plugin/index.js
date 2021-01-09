import { Plugin } from "ittai/entities";
import { getModule } from "ittai/webpack";
import { patcher, logger } from "ittai/utils";

import style from "./style.less";

const FluxDispatcher = getModule("dirtyDispatch");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");
		style.add();

		this.fluxPatch = patcher.patch(
			"flux-patch",
			FluxDispatcher,
			"dispatch",
			"before",
			(args) => {
				logger.log(args);
				return args;
			}
		);
	}

	stop() {
		this.log("Stopping.");
		style.remove();
		this.fluxPatch.unpatch();
	}
}
