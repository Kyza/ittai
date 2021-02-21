import { React } from "ittai/libraries";
import { components, modules, classes } from "ittai/webpack";
import * as logger from "ittai/logger";

import ArchiveMessagesListMessage from "./ArchiveMessagesListMessage";

export default function ArchiveMessagesPopout(props) {
	return (
		<div id={"archive-messages-popout"}>
			{props.settings.get("messages", []).map((m) => (
				<ArchiveMessagesListMessage {...m} />
			))}
		</div>
	);
}
