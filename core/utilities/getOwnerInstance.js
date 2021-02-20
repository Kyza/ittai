import { getReactInstance } from "../utilities";

const { webFrame } = require("electron");

export default function getOwnerInstance(node) {
	for (let curr = getReactInstance(node); curr; curr = curr.return) {
		const owner = curr.stateNode;
		if (
			owner &&
			!(owner instanceof (webFrame?.top?.context?.HTMLElement ?? Element))
		)
			return owner;
	}
	return null;
}
