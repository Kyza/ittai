import { getReactInstance } from "../utilities";

const { webFrame } = require("electron");

export default /**
 * @param {HTMLElement|string} node The node, node ID, node class name, or partial node class name to get the owner instance from.
 * @memberof module:utilities
 * @returns {object}
 */ function getOwnerInstance(node) {
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
