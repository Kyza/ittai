import { modules } from "../../webpack";
import { _ } from "../../webpack/common";
import { messageCache } from "../messages";

const { getMessages: discordGetMessages } = modules.getByProps(
	"getMessages",
	"getMessage"
);

export default function getMessages(channelID) {
	const messages = _.merge(
		_.keyBy(discordGetMessages(channelID)._array, "id"),
		messageCache[channelID] ?? {}
	);
	return (messageCache[channelID] = messages);
}
