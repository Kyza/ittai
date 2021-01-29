/**
 * @module utils
 */

import * as logger from "../logger";
import { modules } from "../webpack";

const { getMessage } = modules.getByProps("getMessages", "getMessage");
const { getMessageByReference } = modules.getByProps("getMessageByReference");
const { Endpoints } = modules.getByProps("Endpoints");
const User = modules.getByFilter((m) => m.prototype.tag);
const Timestamp = modules.getByFilter(
	(m) => m.prototype.toDate && m.prototype.month
);
const Message = modules.getByFilter((m) => m.prototype.isEdited);
const DiscordAPI = modules.getByProps("getAPIBaseURL");

// Know it will work on this client mod or it's detecting the wrong one?
// Set this variable.
let clientMod;

/**
 * @returns {string} The name of the running client mod.
 */
export function getClientMod() {
	if (clientMod) return clientMod;
	if (globalThis.BdApi && !window.powercord?.pluginManager.get("bdCompat")) {
		return (clientMod = "betterdiscord");
	} else if (globalThis.powercord) {
		return (clientMod = "powercordv2");
	} else if (globalThis.vizality) {
		return (clientMod = "vizality");
	} else if (globalThis.Untitled) {
		throw Error("Untitled is not supported yet.");
	}
	throw Error("Unknown client mod.");
}

/**
 * @returns {number} The current time in nanoseconds.
 */
export function nanoseconds() {
	const hrTime = process.hrtime();
	return hrTime[0] * 1000000000 + hrTime[1];
}

/**
 * Finds an object in a tree.
 * @param {Object} tree The tree to search.
 * @param {function} filter A filter function that should return true when it checks what you want to find.
 * @param {Object} options
 * @param {Object} [options.walkable=null] Which node names are walkable.
 * @param {Object} [options.exclude=[]] Which node names to not walk.
 */
export function findInTree(
	tree,
	filter,
	{ walkable = null, exclude = [] } = {}
) {
	if (!tree || typeof tree != "object") return;
	let returnValue;
	if (typeof filter == "string") return tree[filter];
	try {
		if (filter(tree)) return tree;
	} catch {}
	if (Array.isArray(tree))
		for (const value of tree) {
			returnValue = findInTree(value, filter, { walkable, exclude });
			if (returnValue) return returnValue;
		}
	walkable = walkable || Object.keys(tree);
	for (const key of walkable) {
		if (!tree.hasOwnProperty(key) || exclude.includes(key)) continue;
		returnValue = findInTree(tree[key], filter, {
			walkable,
			exclude,
		});
		if (returnValue) return returnValue;
	}
}
// export function findInTree2(
// 	tree,
// 	filter,
// 	{ walkable = null, reverse = false } = {}
// ) {
// 	const stack = [tree];
// 	while (stack.length) {
// 		const node = stack[reverse ? "pop" : "shift"]();
// 		try {
// 			if (filter(node)) return node;
// 		} catch {}
// 		if (typeof node === "object") {
// 			if (walkable) {
// 				stack.push(
// 					...Object.entries(node)
// 						.filter(([key, value]) => walkable.indexOf(key) !== -1)
// 						.map(([key, value]) => value)
// 				);
// 			} else {
// 				stack.push(...Object.values(node));
// 			}
// 		} else if (Array.isArray(node)) stack.push(...node);
// 	}
// 	return null;
// }
/**
 * Finds an object in a React tree.
 * @param {Object} tree The tree to search.
 * @param {function} filter A filter function that should return true when it checks what you want to find.
 */
export function findInReactTree(tree, filter) {
	return findInTree(tree, filter, {
		walkable: ["props", "children", "child", "sibling"],
	});
}

export function getReactInstance(node) {
	if (typeof node === "string")
		node = document.querySelector(
			`${node}, .${node}, #${node}, [class*="${node}"]`
		);
	if (!node) return null;
	return node[
		Object.keys(node).find((e) => e.startsWith("__reactInternalInstance"))
	];
}
export function getOwnerInstance(node) {
	node = getReactInstance(node);
	if (!node) return null;
	for (let curr = node; curr; curr = curr.return) {
		const owner = curr.stateNode;
		if (owner && !(owner instanceof Element)) return owner;
	}
	return null;
}

/**
 *
 * @param {Object} object The object to path into.
 * @param {string[]} path The path to take.
 * @param {*} value The value to set the end node to.
 */
export function ensureTree(object, path, value) {
	let obj = object;
	for (let i = 0; i < path.length; i++) {
		const node = path[i];
		if (i === path.length - 1) return (obj[node] = value), undefined;
		if (!obj[node]) obj[node] = {};
		obj = obj[node];
	}
}

/**
 * @param {function} codeblock The code to benchmark.
 * @param {number} times The amount of times to run the benchmark.
 * @returns {Promise} A Promise that resolves when the benchmark is completed.
 */
export function benchmark(codeblock, times) {
	return new Promise((resolve) => {
		const pre = codeblock.pre ?? (() => {});
		delete codeblock.pre;
		const post = codeblock.post ?? (() => {});
		delete codeblock.post;

		const name = Object.keys(codeblock)[0];

		codeblock = codeblock[Object.keys(codeblock)[0]];

		let promises = [];

		for (let i = 0; i < times; i++) {
			promises.push(
				new Promise((resolve) => {
					let returns, start, end;
					try {
						pre();
						start = nanoseconds();
						returns = codeblock();
						end = nanoseconds();
						post();
					} catch (e) {
						resolve({ returns, time: 0, error: e });
					}
					resolve({ returns, time: end - start, error: false });
				})
			);
		}

		Promise.all(promises).then((allReturns) => {
			const finalTimes = allReturns.map((r) => r.time);
			resolve({
				name,
				average: average(finalTimes),
				median: median(finalTimes),
				error: allReturns[0].error,
				returns: allReturns[0].returns,
			});
		});
	});
}

/**
 * Prints out the benchmark results for each code block.
 * @param {function} codeblock The code to benchmark.
 * @param {number} times The amount of times to run the benchmark.
 */
export function multiBenchmark(codeblocks, times) {
	return new Promise((resolve) => {
		const start = nanoseconds();
		Promise.all(
			codeblocks.map((codeblock) => benchmark(codeblock, times))
		).then((results) => {
			const end = nanoseconds();
			const groupName = `Benchmarked ${codeblocks.length.toLocaleString()} functions ${times.toLocaleString()} times over ${(
				end - start
			).toLocaleString()}ns.`;
			logger.group(groupName);
			const mappedResults = Object.values(results).map((result) => {
				return {
					Name: result.name,
					"Median Time": `${result.median.toLocaleString()}ns`,
					"Average Time": `${result.average.toLocaleString()}ns`,
					Returns: result.returns,
					Error: result.error,
					"(Median Time)": result.median,
					"(Average Time)": result.average,
				};
			});
			const successfulResults = mappedResults.filter(
				(result) => result.Error === false
			);
			const erroredResults = mappedResults.filter((result) => !!result.Error);

			console.table(
				successfulResults.sort((result1, result2) => {
					if (result1["(Median Time)"] > result2["(Median Time)"]) return 1;
					if (result1["(Median Time)"] < result2["(Median Time)"]) return -1;
					return 0;
				}),
				["Name", "Median Time", "Average Time", "Returns"]
			);
			if (erroredResults.length > 0) {
				console.table(erroredResults, ["Name", "Error"]);
			}

			logger.groupEnd(groupName);
			resolve(results);
		});
	});
}

/**
 * @param {number[]} array An array of numbers.
 * @returns {number} The average of the numbers in the array.
 */
export function average(array) {
	if (array.length === 0) return 0;
	let total = 0;
	for (let i = 0; i < array.length; i++) {
		total += array[i];
	}
	return total / array.length;
}

/**
 * @param {number[]} array An array of numbers.
 * @returns {number} The median of the numbers in the array.
 */
export function median(array) {
	if (array.length === 0) return 0;
	array.sort(function (a, b) {
		return a - b;
	});
	let half = Math.floor(array.length / 2);
	if (array.length % 2) return array[half];
	return (array[half - 1] + array[half]) / 2.0;
}

function throwTypeError(variable, name, type, ignoreNull = false) {
	if (ignoreNull && (variable === null || variable === undefined)) return;
	if (
		(type.toLowerCase() === "array" && !Array.isArray(variable)) ||
		typeof variable !== type
	)
		throw `"${name}" is not of type "${type}"`;
}

/**
 * @param {number} length The length of the string.
 * @param {number} length The returned string will not match this.
 * @returns {string} A string of random characters.
 */
export function randomString(length, dontMatch = null) {
	if (typeof length !== "number") return;
	if (typeof dontMatch !== "string" && !Array.isArray(dontMatch)) return;
	let string = "";
	do {
		while (string.length < length) {
			string += Math.random().toString(36).substring(2);
		}
		string = string.slice(0, length);
	} while (
		dontMatch &&
		(string === dontMatch || dontMatch.some((m) => m === string))
	);
	return string;
}

let messageCache = {};

export function fetchMessage(channelID, messageID) {
	return new Promise((resolve, reject) => {
		const message =
			getMessage(channelID, messageID) ??
			getMessageByReference({
				message_id: messageID,
				channel_id: channelID,
			}).message ??
			messageCache[channelID]?.[messageID];

		if (message) return resolve(message);

		DiscordAPI.get({
			url: Endpoints.MESSAGES(channelID),
			query: {
				limit: 100,
				around: messageID,
			},
		})
			.then((res) => {
				if (res.status != 200) return reject();
				for (let m of res.body) {
					m.author = new User(m.author);
					m.timestamp = new Timestamp(m.timestamp);
					m = new Message(m);
					ensureTree(messageCache, [m.channel_id, m.id], m);
				}
				const foundMessage = messageCache[channelID]?.[messageID];
				if (foundMessage) resolve(foundMessage);
				reject();
			})
			.catch((res) => {
				console.log(res);
				if (res.status != 403) return reject();
			});
	});
}
