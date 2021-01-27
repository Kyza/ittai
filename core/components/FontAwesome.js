import { getByProps } from "../webpack/modules";
const React = getByProps("useState");

/**
 *
 * @param {object} props - React properties.
 * @param {string} props.type - The FontAwesome icon type. `solid`, `regular`, `light`, `duotone`, `brand`.
 * @param {string} props.className - For extra class features that aren't directly supported. Example: https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons
 * @param {number} props.size - The size of the icon in pixels. Don't include `px`.
 */
export function FontAwesome(props) {
	return (
		<i
			className={`fa${props.type?.[0] ? props.type[0].toLowerCase() : "s"} fa-${
				props.name ? props.name : "debug"
			}${props.className ? " " + props.className : ""}`}
			style={{ fontSize: props.size ? props.size + "px" : "48px" }}
		/>
	);
}
