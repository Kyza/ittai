export default /**
 * @param {number} min The minimum value of the returned number.
 * @param {number} mix The maximum value of the returned number.
 * @memberof module:utilities
 * @returns {number} A random number.
 */ function randomNumber(min, max) {
	return Math.random() * max - min;
}
