import { React } from "ittai/libraries";
import { components, modules, classes } from "ittai/webpack";
import * as logger from "ittai/logger";

import ArchiveMessagesListMessage from "./ArchiveMessagesListMessage";

export default function ArchiveMessagesList(props) {
	logger.log("eeeee", props.settings.get("pins", []));
	return (
		<div
			style={{
				margin: "8px",
				marginBottom: "0",
			}}
		>
			{props.settings.get("pins", []).map((m) => (
				<ArchiveMessagesListMessage message={m} />
			))}
		</div>
	);
}
