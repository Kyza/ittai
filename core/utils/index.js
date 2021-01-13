import getClientMod from "./getClientMod";
import * as logger from "./logger";

export * as patcher from "./patcher";
export * as logger from "./logger";

// Know it will work on this client mod or it's detecting the wrong one?
// Set this variable.
let clientMod;

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
	} else if (globalThis.nxt) {
		throw Error("How the hell did you get this client mod.");
	}
	throw Error("Unknown client mod.");
}

export function nanoseconds() {
	const hrTime = process.hrtime();
	return hrTime[0] * 1000000000 + hrTime[1];
}

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

export function average(array) {
	if (array.length === 0) return 0;
	let total = 0;
	for (let i = 0; i < array.length; i++) {
		total += array[i];
	}
	return total / array.length;
}

export function median(array) {
	if (array.length === 0) return 0;
	array.sort(function (a, b) {
		return a - b;
	});
	let half = Math.floor(array.length / 2);
	if (array.length % 2) return array[half];
	return (array[half - 1] + array[half]) / 2.0;
}

export function randomString(length) {
	let string = "";
	while (string.length < length) {
		string += Math.random().toString(36).substring(2);
	}
	return string.slice(0, length);
}

export function* searchTree(tree, value, key, reverse = false) {
	const stack = [tree[0]];
	while (stack.length) {
		const node = stack[reverse ? "pop" : "shift"]();
		if (node[key] === value) yield node;
		node.children && stack.push(...node.children);
	}
}
export function* searchTreeKey(tree, key, reverse = false) {
	const stack = Object.keys(tree).map((t) => ({ key: t, value: tree[t] }));
	while (stack.length) {
		const node = stack[reverse ? "pop" : "shift"]();
		if (node.key === key) yield node.value;
		if (node.value ?? false) {
			stack.push(
				...Object.keys(node.value).map((t) => ({
					key: t,
					value: node.value[t],
				}))
			);
		}
	}
}
