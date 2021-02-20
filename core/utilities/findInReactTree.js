import { findInTree } from "../utilities";

/**
 * Finds an object in a React tree.
 * @param {Object} tree The tree to search.
 * @param {function} filter A filter function that should return true when it checks what you want to find.
 * @param {Object} [whileLoop=false] Whether or not to use a while loop instead of recursion. This is slower, but not prone to stack overflow.
 */
export default function findInReactTree(
	tree,
	filter,
	{ whileLoop = false, maxDepth = 100, depth = 0 } = {}
) {
	return findInTree(tree, filter, {
		walkable: ["props", "children", "child", "sibling"],
		exclude: ["__reactInternalInstance$", "__reactInternalInstance"],
		whileLoop,
		maxDepth,
		depth,
	});
}
