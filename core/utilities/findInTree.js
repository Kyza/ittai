import { error } from "../logger";

export default /**
 * Finds an object in a tree.
 * @param {object} tree The tree to search.
 * @param {function} filter A filter function that should return true when it checks what you want to find.
 * @param {object} options
 * @param {string[]} [options.walkable=[]] Which node names are walkable.
 * @param {string[]} [options.exclude=[]] Which node names to not walk.
 * @param {boolean|string} [options.whileLoop=false] Whether or not to use a while loop instead of recursion. This is slower, but not prone to stack overflow.
 * @param {boolean|string} [options.maxDepth=100] The maximum amount of layers deep to search the tree. `options.whileLoop=false` only.
 * @memberof module:utilities
 * @returns {object|null}
 */ function findInTree(
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
	if (typeof tree !== "object") return null;

	if (typeof filter === "string") return tree[filter];

	if (whileLoop) {
		const stack = [tree];
		while (stack.length) {
			const node = stack[whileLoop === "reverse" ? "pop" : "shift"]();
			try {
				if (filter(node)) return node;
			} catch {}
			if (stack.length >= maxStack) continue;
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
		let keys = walkable.length > 0 ? walkable : Object.keys(tree);
		for (const key of keys) {
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
