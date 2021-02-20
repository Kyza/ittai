export default function getReactInstance(node) {
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
