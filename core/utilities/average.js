/**
 * @param {number[]} array An array of numbers.
 * @returns {number} The average of the numbers in the array.
 */
export default function average(array) {
	if (array.length === 0) return 0;
	let total = 0;
	for (let i = 0; i < array.length; i++) {
		total += array[i];
	}
	return total / array.length;
}
