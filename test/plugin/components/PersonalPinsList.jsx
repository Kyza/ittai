import { React } from "ittai/libraries";
import { components, modules, classes } from "ittai/webpack";
import * as logger from "ittai/logger";
import { fetchMessage } from "ittai/utils";

import PersonalPinsListMessage from "./PersonalPinsListMessage";

const margins = classes.getByNames("marginTop20");

const { ChannelMessage } = components.all;

const { getChannel } = modules.getByProps("getChannel");

const messages = [
	{ messageID: "804450187522867231", channelID: "639664211592478720" },
	{ messageID: "804542199797907486", channelID: "639664211592478720" },
];

export default function PersonalPinsList(props) {
	return (
		<div style={{ margin: "8px" }}>
			{messages.map((m) => (
				<PersonalPinsListMessage message={m} />
			))}
		</div>
	);
}
