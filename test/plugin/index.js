import { Plugin } from "./ittai/entities";
import { getModule } from "./ittai/webpack";
import style from "./style.css";

const { getChannelId } = getModule("getLastSelectedChannelId");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.", getChannelId());
		style.use();
	}

	stop() {
		this.log("Stopping.");
		style.unuse();
	}
}
