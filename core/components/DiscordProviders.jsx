import { React } from "../webpack/common";
import { components, modules } from "../webpack";

const LayerProvider = components.all.AppLayerProvider().props.layerContext
	.Provider;
const AccessibilityProvider = modules.getByProps(
	"AccessibilityPreferencesContext"
).AccessibilityPreferencesContext.Provider;
const layerClass = modules.getByProps("LayerClassName").LayerClassName;

/**
 * Render any Discord icon.
 * @name DiscordProviders
 * @param {object} props React properties. All unlisted properties will be passed down to the component.
 * @param {string} [props.type="default"] The FontAwesome icon type. `default`, `minipopover`.
 * @param {string} [props.name] The `displayName` of the icon component in Discord.
 * @memberof module:components
 * @example
 * return (
 *   <DiscordIcon type="minipopover" />
 * );
 */
export default function DiscordProviders(props) {
	return (
		<AccessibilityProvider
			value={{ reducedMotion: { enabled: false, rawValue: "no-preference" } }}
		>
			<LayerProvider
				value={[document.querySelector("#app-mount > ." + layerClass)]}
			>
				{props.children}
			</LayerProvider>
		</AccessibilityProvider>
	);
}
