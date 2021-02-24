#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const build = require("./build");

const { header } = require("./ui");

if (argv.plugin && (argv.powercordv2 || argv.betterdiscord || argv.vizality)) {
	header(argv);
	build(argv);
}
