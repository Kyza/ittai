import { modules } from "../../webpack";

const FluxDispatcher = modules.getByProps("dispatch", "dirtyDispatch");

export default function updateMessage(message, props = {}) {
	FluxDispatcher.dirtyDispatch({
		...props,
		type: "MESSAGE_UPDATE",
		message,
	});
}
