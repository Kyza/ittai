import { React } from "ittai/libraries";
import { components, modules } from "ittai/webpack";
import * as logger from "ittai/logger";
import { FontAwesome } from "ittai/components";

const { Button } = modules.getByDisplayName("MiniPopover");
const { Tooltip } = components.all;

export default function ArchivesButton(props) {
	const [archived, setArchived] = React.useState(
		props.settings
			.get("messages", [])
			.some(
				(messages) =>
					messages.messageID === props.message.id &&
					messages.channelID === props.channel.id
			)
	);

	return (
		<Tooltip
			color={Tooltip.Colors.PRIMARY}
			postion={Tooltip.Positions.TOP}
			text={archived ? "Unarchive Message" : "Archive Message"}
		>
			{({ onMouseLeave, onMouseEnter }) => (
				<Button
					onClick={
						archived
							? () => {
									let messages = props.settings.get("messages", []);
									const messageIndex = messages.indexOf(
										messages.filter(
											(message) =>
												message.messageID === props.message.id &&
												message.channelID === props.channel.id
										)
									);
									messages.splice(messageIndex, 1);
									props.settings.set({ messages });
									setArchived(false);
							  }
							: () => {
									let messages = props.settings.get("messages", []);
									messages.push({
										archivedAt: new Date(),
										messageID: props.message.id,
										channelID: props.channel.id,
									});
									props.settings.set({ messages });
									setArchived(true);
							  }
					}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
				>
					<FontAwesome
						type={archived ? "regular" : "solid"}
						name="archive"
						size="20"
					/>
				</Button>
			)}
		</Tooltip>
	);
}
