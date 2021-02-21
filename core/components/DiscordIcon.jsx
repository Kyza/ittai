import { React } from "../webpack/common";
import { classes, components } from "../webpack";

const types = {
	minipopover: classes.getByNames("icon", "isHeader").icon,
	default: classes.getByNames("icon", "selected").icon,
};

/**
 * Render any Discord icon.
 * @name DiscordIcon
 * @param {object} props React properties. All unlisted properties will be passed down to the component.
 * @param {string} [props.type="default"] The FontAwesome icon type. `default`, `minipopover`.
 * @param {string} [props.name] The `displayName` of the icon component in Discord.
 * @memberof module:components
 * @example
 * return (
 *   <DiscordIcon type="minipopover" />
 * );
 */
export default function DiscordIcon(props) {
	const IconSVG =
		components.all[props.name] ??
		(() => {
			return "";
		});
	return (
		<IconSVG
			{...props}
			className={types[props.type ?? "default"] ?? "default"}
		/>
	);
}
