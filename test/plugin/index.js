import { Plugin } from "ittai/entities";
import { getModule } from "ittai/webpack";
import { patcher, logger } from "ittai/utils";

const ApplicationCommandDiscoverySectionList = getModule(
	(m) => m.default?.displayName === "ApplicationCommandDiscoverySectionList"
);

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");

		this.ACDSL = patcher.patch(
			"categories",
			ApplicationCommandDiscoverySectionList,
			"default",
			"after",
			(args, res) => {
				logger.log(args, res);
				return res;
			}
		);
	}

	stop() {
		this.log("Stopping.");
		this.ACDSL.unpatch();
	}
}
