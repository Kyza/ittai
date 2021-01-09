#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

if (
	argv.plugin &&
	(argv.powercordv2 ||
		argv.betterdiscord ||
		argv.enhanceddiscord ||
		argv.vizality)
) {
	require("./build")(argv);
}
