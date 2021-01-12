import { Plugin } from "ittai/entities";
import { React, getModuleByDisplayName } from "ittai/webpack";

const Text = getModuleByDisplayName("Text");
const SwitchItem = getModuleByDisplayName("SwitchItem");
const Tooltip = getModuleByDisplayName("Tooltip");

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");
		this.setSettingsPanel(() => {
			const [on, setOn] = React.useState(this.getSetting("on", false));

			return (
				<>
					<Tooltip color="black" postion="top" text="Tooltip Test">
						{(props) => <Text {...props}>Test settings panel.</Text>}
					</Tooltip>
					<SwitchItem
						value={on}
						onChange={(event) => {
							this.setSetting("on", event);
							setOn(this.getSetting("on"));
						}}
						note="Flip switch save settings."
					>
						Flippy Flippy Switch
					</SwitchItem>
				</>
			);
		});
	}

	stop() {
		this.removeSettingsPanel();
		this.log("Stopping.");
	}
}
