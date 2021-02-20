/** * Finds an object in a tree. * @param {Object} tree The tree to search. * @param {function} filter A filter function that should return true when it checks what you want to find. * @param {Object} options * @param {string[]} [options.walkable=[]] Which node names are walkable. * @param {string[]} [options.exclude=[]] Which node names to not walk. * @param {boolean|string} [options.whileLoop=false] Whether or not to use a while loop instead of recursion. This is slower, but not prone to stack overflow. * @returns {object|null} */ export default function findInTree(
	tree,
	filter,
	{
		walkable = [],
		exclude = [],
		whileLoop = false,
		maxDepth = 100,
		depth = 0,
	} = {}
) {
	if (depth === maxDepth) return null;
	if (tree === null || tree === undefined) return null;
	if (!tree || typeof tree !== "object") {
		return logger.error(
			`The specified tree is not an object. Instead got:`,
			tree
		);
	}
	if (typeof filter === "string") return tree[filter];
	if (whileLoop) {
		const stack = [tree];
		while (stack.length) {
			if (depth === maxDepth) return null;
			const node = stack[whileLoop === "reverse" ? "pop" : "shift"]();
			try {
				if (filter(node)) return node;
			} catch {}
			if (Array.isArray(node)) {
				stack.push(...node);
			} else if (typeof node === "object" && node !== null) {
				if (walkable.length > 0) {
					stack.push(
						...Object.entries(node)
							.filter(
								([key, value]) =>
									walkable.indexOf(key) !== -1 && exclude.indexOf(key) === -1
							)
							.map(([key, value]) => value)
					);
				} else {
					stack.push(
						...Object.values(node).filter(
							(key) => exclude.indexOf(key) === -1 && node
						)
					);
				}
			}
			depth++;
		}
		return null;
	} else {
		let returnValue;
		try {
			if (filter(tree)) return tree;
		} catch {}
		if (Array.isArray(tree)) {
			for (const value of tree) {
				returnValue = findInTree(value, filter, {
					walkable,
					exclude,
					whileLoop,
					maxDepth,
					depth: depth + 1,
				});
				if (returnValue) return returnValue;
			}
		}
		walkable = walkable || Object.keys(tree);
		for (const key of walkable) {
			if (!tree.hasOwnProperty(key) || exclude.includes(key)) continue;
			returnValue = findInTree(tree[key], filter, {
				walkable,
				exclude,
				whileLoop,
				maxDepth,
				depth: depth + 1,
			});
			if (returnValue) return returnValue;
		}
		return null;
	}
}
