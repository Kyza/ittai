export default /**
 * @param {HTMLElement|string} node The node, node ID, node class name, or partial node class name to get the React instance from.
 * @memberof module:utilities
 * @returns {object}
 */ function getReactInstance(node) {
	if (typeof node === "string")
		node = document.querySelector(
			`${node}, .${node}, #${node}, [class*="${node}"]`
		);
	if (!node) return null;
	if (node.__reactInternalInstance$) return node.__reactInternalInstance$;
	return node[
		Object.keys(node).find((e) => e.startsWith("__reactInternalInstance"))
	];
}
