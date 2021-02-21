import { findInTree } from "../utilities";

export default /**
 * Finds an object in a React tree.
 * @memberof module:utilities
 * @param {object} tree The tree to search.
 * @param {function} filter A filter function that should return true when it checks what you want to find.
 * @param {object} [whileLoop=false] Whether or not to use a while loop instead of recursion. This is slower, but not prone to stack overflow.
 */ function findInReactTree(
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
