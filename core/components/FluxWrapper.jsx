import { React } from "../webpack/common";
import { modules } from "../webpack";
import * as logger from "../logger";

const { connectStores } = modules.getByProps("connectStores");

export default function FluxWrapper(props) {
	logger.log("gfndjksgbfjdhjirbfdsuk");
	return (
		<>
			{connectStores(
				props.stores ?? [],
				props.createProps ??
					((all) => {
						logger.log("bgfhjsbgf", all);
						return all;
					})
			)(props.children)}
		</>
	);
}
