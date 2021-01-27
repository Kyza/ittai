import { React } from "../webpack/libraries";

/**
 * Render any {@link https://fontawesome.com/|FontAwesome} icon.
 * @component
 * @example
 * <FontAwesome type="brand" name="discord" size="22" />
 * @param {object} props React properties.
 * @param {string} [props.type="solid"] The FontAwesome icon type. `solid`, `regular`, `light`, `duotone`, `brand`.
 * @param {number} props.size The size of the icon in pixels. Don't include `px`.
 * @param {string} props.className {@link https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons|For extra class features that aren't directly supported.}
 * @category reactComponents
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
