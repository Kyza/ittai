import { modules } from "../../webpack";
import { updateMessage } from "../messages";

const { getMessage: discordGetMessage } = modules.getByProps(
	"getMessages",
	"getMessage"
);

export default function rerenderMessage(idOrMessage, props = {}) {
	let message =
		typeof idOrMessage === "string"
			? discordGetMessage(idOrMessage)
			: idOrMessage;
	if (!message) return;
	message = {
		id: message.id,
		channel_id: message.channel_id,
		content: message.content,
	};
	updateMessage(message, props);
}
