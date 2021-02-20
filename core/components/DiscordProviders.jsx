import { React } from "../libraries";
import { components, modules } from "../webpack";

const LayerProvider = components.all.AppLayerProvider().props.layerContext
	.Provider;
const AccessibilityProvider = modules.getByProps(
	"AccessibilityPreferencesContext"
).AccessibilityPreferencesContext.Provider;
const layerClass = modules.getByProps("LayerClassName").LayerClassName;

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
