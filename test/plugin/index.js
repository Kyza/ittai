import { Plugin } from "./ittai/entities";
import { getModule } from "./ittai/webpack";
import logger from "./ittai/utils/logger";
import patcher from "./ittai/utils/patcher";

import style from "./style.css";

const FluxDispatcher = getModule("dirtyDispatch");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");
		style.add();

		this.fluxPatch = patcher.patch(
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
