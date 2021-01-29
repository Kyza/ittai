import { React } from "ittai/libraries";
import { components, modules } from "ittai/webpack";
import * as logger from "ittai/logger";
import FontAwesome from "ittai/components/FontAwesome";

const { Button } = modules.getByDisplayName("MiniPopover");
const { Tooltip } = components.all;

export default function PinButton(props) {
	return (
		<Tooltip
			color={Tooltip.Colors.PRIMARY}
			postion={Tooltip.Positions.TOP}
			text="Personally Pin Message"
		>
			{({ onMouseLeave, onMouseEnter }) => (
				<Button
					onClick={() => {
						let pins = props.settings.get("pins", {});
						if (!pins)
							pins.push({
								messageID: props.message.id,
								channelID: props.channel.id,
							});
					}}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
				>
					<FontAwesome name="thumbtack" size="20" />
				</Button>
			)}
		</Tooltip>
	);
}
