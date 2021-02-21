export default /**
 * Wraps a filter to make it error safe.
 * @memberof module:webpack/modules
 * @returns {Object} The safe filter.
 */ function wrapFilter(filter) {
	return (mod) => {
		try {
			return filter(mod);
		} catch {}
	};
}
