export default function createArguments(...args) {
	return [
		"%cIttai",
		"color: #000; background-color: #42ffa7; font-family: default; padding-left: 3px; padding-right: 3px; border-radius: 2px; font-weight: bold;",
		...args,
	];
}
