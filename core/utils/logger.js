const cc = { ...console };

export function createArguments(...args) {
	return [
		"%cIttai",
		"color: #000; background-color: #42ffa7; font-family: default; padding-left: 3px; padding-right: 3px; border-radius: 2px; font-weight: bold;",
		...args,
	];
}

export function log(...args) {
	cc.log(...createArguments(...args));
}
export function debug(...args) {
	cc.debug(...createArguments(...args));
}
export function warn(...args) {
	cc.warn(...createArguments(...args));
}
export function error(...args) {
	cc.error(...createArguments(...args));
}
export function group(...args) {
	cc.group(...createArguments(...args));
}
export function groupEnd(...args) {
	cc.groupEnd(...createArguments(...args));
}
