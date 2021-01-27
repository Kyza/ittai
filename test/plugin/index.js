import { Plugin } from "ittai/entities";
import { modules } from "ittai/webpack";
import { patcher } from "ittai/utils";

const ChannelCallGrid = modules.getByDisplayName("ChannelCallGrid");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");
		patcher.before(
			"ChannelCallGrid-default",
			ChannelCallGrid,
			"default",
			(that, args) => {
				if (args[0].participants.some((p) => p.hasOwnProperty("stream"))) {
					args[0].participants = args[0].participants.filter((p) =>
						p.hasOwnProperty("stream")
					);
				}
				return args;
			}
		);
	}
	stop() {
		this.log("Stopping.");
		patcher.unpatchAll();
	}
}
