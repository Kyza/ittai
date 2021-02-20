export default function wrapFilter(filter) {
	return (mod) => {
		try {
			return filter(mod);
		} catch {}
	};
}
