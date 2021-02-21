export default /**
 * @memberof module:utilities
 * @returns {number} The current time in nanoseconds.
 */ function nanoseconds() {
	const hrTime = process.hrtime();
	return hrTime[0] * 1000000000 + hrTime[1];
}
