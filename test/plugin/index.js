import { Plugin } from "./ittai/entities";
import { getModule } from "./ittai/webpack";
import logger from "./ittai/utils/logger";
import style from "./style.css";
import patcher from "./ittai/utils/patcher";

const FluxDispatcher = getModule("dirtyDispatch");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");
		style.use();

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
		style.unuse();
		this.fluxPatch.unpatch();
	}
}
