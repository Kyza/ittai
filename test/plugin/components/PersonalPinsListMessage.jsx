import { React } from "ittai/libraries";
import { components, modules, classes } from "ittai/webpack";
import * as logger from "ittai/logger";
import FontAwesome from "ittai/components/FontAwesome";
import { fetchMessage, getOwnerInstance } from "ittai/utils";

const { ChannelMessage } = components.all;

const { getChannel } = modules.getByProps("getChannel");

const { messageGroupWrapper } = classes.getByNames("messageGroupWrapper");

export default React.memo(function PersonalPinsListMessage(props) {
	const [message, setMessage] = React.useState("loading");
	const channel = getChannel(props.message.channelID);

	React.useEffect(() => {
		logger.log(
			"Getting message.",
			props.message.channelID,
			props.message.messageID
		);
		fetchMessage(props.message.channelID, props.message.messageID)
			.then((m) => {
				setMessage(m);
				// getOwnerInstance("messagesPopoutWrap")?.forceUpdate();
			})
			.catch((e) => {
				logger.error("Failed to get message.", e, channelID, messageID);
				setMessage("error");
			});
	});

	if (message === "loading") {
		return "Loading message.";
	} else if (message === "error") {
		return "Error loading message.\n";
	}
	logger.log(message);
	return (
		<div className={messageGroupWrapper}>
			<ChannelMessage message={message} channel={channel} />
		</div>
	);
});
