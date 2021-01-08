function createArguments(...args) {
	return [
		"%cIttai",
		"color: #000; background-color: #42ffa7; font-family: default; padding-left: 3px; padding-right: 3px; border-radius: 2px; font-weight: bold;",
		...args,
	];
}

export default {
	log: (...args) => {
		console.log(...createArguments(...args));
	},
	debug: (...args) => {
		console.debug(...createArguments(...args));
	},
	warn: (...args) => {
		console.warn(...createArguments(...args));
	},
	error: (...args) => {
		console.error(...createArguments(...args));
	},
};
