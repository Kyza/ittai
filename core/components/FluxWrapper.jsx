import { React, Flux } from "../webpack/common";

export default function FluxWrapper(props) {
	if (!props.children.displayName) props.children.displayName = "FluxProxy";
	const ConnectedComponent = Flux.connectStores(
		props.stores ? Object.values(props.stores) : [],
		props.createProps ??
			(() => {
				return { [Math.random()]: Math.random() };
			})
	)(props.children);
	return <ConnectedComponent {...props.stores} />;
}
