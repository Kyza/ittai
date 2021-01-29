import { React } from "ittai/libraries";
import { components, modules } from "ittai/webpack";
import * as logger from "ittai/logger";

const { ChannelMessage, Header } = components.all;
const { getMessage } = modules.getByProps("getMessages", "getMessage");
const { getChannel } = modules.getByProps("getChannel");

export default function Settings() {
	return (
		<>
			<Header size={Header.Sizes.SIZE_24}>Personal Pins</Header>
			<ChannelMessage
				message={getMessage("639664211592478720", "804450187522867231")}
				channel={getChannel("639664211592478720")}
			/>
		</>
	);
}
