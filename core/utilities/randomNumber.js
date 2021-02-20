/**
 * @param {number} min The minimum value of the returned number.
 * @param {number} mix The maximum value of the returned number.
 * @returns {number} A random number.
 */
export default function randomNumber(min, max) {
	return Math.random() * max - min;
}
