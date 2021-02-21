import { modules } from "../../webpack";
import { _ } from "../../webpack/common";
import { messageCache, getMessage } from "../messages";

const { Endpoints } = modules.getByProps("Endpoints");
const User = modules.getByFilter((m) => m.prototype.tag);
const Timestamp = modules.getByFilter(
	(m) => m.prototype.toDate && m.prototype.month
);
const Message = modules.getByFilter((m) => m.prototype.isEdited);
const DiscordAPI = modules.getByProps("getAPIBaseURL");

export default function fetchMessage(channelID, messageID) {
	return new Promise((resolve, reject) => {
		const message = getMessage(channelID, messageID);

		if (message) return resolve(message);

		DiscordAPI.get({
			url: Endpoints.MESSAGES(channelID),
			query: {
				limit: 100,
				around: messageID,
			},
		})
			.then((res) => {
				if (res.status != 200) return reject();
				for (let m of res.body) {
					m.author = new User(m.author);
					m.timestamp = new Timestamp(m.timestamp);
					m = new Message(m);
					_.set(messageCache, [m.channel_id, m.id], m);
				}
				const foundMessage = messageCache[channelID]?.[messageID];
				if (foundMessage) resolve(foundMessage);
				reject();
			})
			.catch((res) => {
				// logger.error(res);
				if (res.status != 403) return reject();
			});
	});
}
