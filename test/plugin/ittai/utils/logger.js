function createArguments(...args) {
	return [
		"%cITTAI",
		"color: #000; background-color: #42ffa7; font-family: default; padding: 3px; border-radius: 2px;",
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
