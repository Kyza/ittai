import { React } from "../libraries";

/**
 * Render any {@link https://fontawesome.com/|FontAwesome} icon. This includes FontAwesome Pro icons.
 * @name FontAwesome
 * @param {object} props React properties.
 * @param {string} [props.type="solid"] The FontAwesome icon type. `solid`, `regular`, `light`, `duotone`, `brand`.
 * @param {number} [props.size=48] The size of the icon in pixels. Don't include `px`.
 * @param {string} [props.className=""] {@link https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons|For extra class features that aren't directly supported.}
 * @memberof module:components
 * @example
 * return (
 *   <FontAwesome type="brand" name="discord" size="22" />
 * );
 */
export default function FontAwesome(props) {
	return (
		<i
			{...props}
			className={`fa${props.type?.[0] ? props.type[0].toLowerCase() : "s"} fa-${
				props.name ? props.name : "debug"
			}${props.className ? " " + props.className : ""}`}
			style={{ fontSize: props.size ? props.size + "px" : "48px" }}
		/>
	);
}
