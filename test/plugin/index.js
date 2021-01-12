import { Plugin } from "ittai/entities";
import { React, getModuleByDisplayName } from "ittai/webpack";

const Text = getModuleByDisplayName("Text");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");
		this.setSettingsPanel("Test Plugin", <Text>Test settings panel.</Text>);
	}

	stop() {
		this.removeSettingsPanel();
		this.log("Stopping.");
	}
}
