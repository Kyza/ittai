import { randomNumber } from "../utilities";

/**
 * @param {number} length The length of the string.
 * @param {string|array} dontMatch A string or an array of strings that will cause a regeneration if any are matched.
 * @param {string|array} charset A list of the characters to use when generating the string.
 * @returns {string} A string of random characters.
 */
export default function randomString(
	length,
	dontMatch = "",
	charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
) {
	if (typeof length !== "number" && length <= 0) return;
	if (typeof dontMatch !== "string" && !Array.isArray(dontMatch)) return;
	if (typeof charset !== "string" && !Array.isArray(charset)) return;
	let string = "";
	do {
		while (string.length < length) {
			string += charset[Math.round(randomNumber(0, charset.length - 1))];
		}
		string = string.slice(0, length);
	} while (
		dontMatch &&
		(string === dontMatch || dontMatch.some((m) => m === string))
	);
	return string;
}
