import { React } from "ittai/libraries";
import { components, modules, classes } from "ittai/webpack";
import * as logger from "ittai/logger";
import { DiscordProviders, FontAwesome, FluxWrapper } from "ittai/components";
import ArchiveMessagesPopout from "./ArchiveMessagesPopout";

const { Popout, Tooltip } = components.all;

const WindowStore = modules.getByProps("windowSize", "isFocused");
const { connectStores } = modules.getByProps("connectStores");
// const { useStateFromStores } = modules.getByProps("useStateFromStores");

const iconClasses = classes.getByNames("clickable", "icon");

export default function ArchivesButton(props) {
	const [popoutOpen, setPopoutOpen] = React.useState(false);

	return (
		<>
			{connectStores([WindowStore], (all) => {
				logger.log("bgfhjsbgf", all);
				return all;
			})(() => (
				<DiscordProviders>
					<Popout
						renderPopout={(popoutProps) => (
							<ArchiveMessagesPopout
								{...popoutProps}
								settings={props.settings}
							/>
						)}
						nudgeAlignIntoViewport={true}
						position={Popout.Positions.BOTTOM}
						shouldShow={popoutOpen}
						animation={Popout.Animation.FADE}
					>
						{(props) => (
							<div
								{...props.popoutProps}
								className={`${iconClasses.iconWrapper} ${iconClasses.clickable}`}
							>
								{popoutOpen ? (
									<Icon setPopoutOpen={setPopoutOpen} popoutOpen={popoutOpen} />
								) : (
									<Tooltip
										color={Tooltip.Colors.PRIMARY}
										position={Tooltip.Positions.BOTTOM}
										text={"Message Archives"}
									>
										{({ onMouseLeave, onMouseEnter }) => (
											<Icon
												onMouseEnter={onMouseEnter}
												onMouseLeave={onMouseLeave}
												setPopoutOpen={setPopoutOpen}
												popoutOpen={popoutOpen}
											/>
										)}
									</Tooltip>
								)}
							</div>
						)}
					</Popout>
				</DiscordProviders>
			))}
		</>
	);
}

function Icon(props) {
	return (
		<div
			{...props}
			onClick={() => {
				props.setPopoutOpen(!props.popoutOpen);
			}}
		>
			<FontAwesome
				type="solid"
				name="archive"
				size="24"
				className={iconClasses.icon}
			/>
		</div>
	);
}
