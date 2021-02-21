import { modules } from "../../webpack";
import { _ } from "../../webpack/common";
import { messageCache } from "../messages";

const { getMessage: discordGetMessage } = modules.getByProps(
	"getMessages",
	"getMessage"
);
const { getMessageByReference } = modules.getByProps("getMessageByReference");

export default function getMessage(channelID, messageID) {
	return _.set(
		messageCache,
		[channelID, messageID],
		discordGetMessage(channelID, messageID) ??
			getMessageByReference({
				message_id: messageID,
				channel_id: channelID,
			}).message ??
			messageCache[channelID]?.[messageID]
	)[channelID][messageID];
}
