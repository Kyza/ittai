import { modules } from "../../webpack";
import { rerenderMessage } from "../messages";

const { getMessages: discordGetMessages } = modules.getByProps(
	"getMessages",
	"getMessage"
);
const { getChannelId } = modules.getByProps("getChannelId");

export default function rerenderAllMessages(props = {}) {
	const messages = discordGetMessages(getChannelId())._array;
	for (const message of messages) {
		rerenderMessage(message, props);
	}
}
