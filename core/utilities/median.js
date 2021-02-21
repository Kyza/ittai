export default /**
 * @param {number[]} array An array of numbers.
 * @memberof module:utilities
 * @returns {number} The median of the numbers in the array.
 */ function median(array) {
	if (array.length === 0) return 0;
	array.sort(function (a, b) {
		return a - b;
	});
	let half = Math.floor(array.length / 2);
	if (array.length % 2) return array[half];
	return (array[half - 1] + array[half]) / 2.0;
}
