const fs = require("fs-extra");
const path = require("path");

const term = require("terminal-kit").terminal;

term.grabInput();

term.on("key", function (name, matches, data) {
	if (name === "CTRL_C") {
		term.fullscreen(false);
		process.exit();
	}
	// if (name === "CTRL_B") {
	// 	if (!building) {
	// 		building = true;
	// 		build(argv, true).then(() => (building = false));
	// 	}
	// }
});

term.hideCursor();

module.exports.header = (argv) => {
	const bdFileName = `${fs
		.readJSONSync(path.join(argv.plugin, "manifest.json"))
		.name.replace(/ /g, "")}.plugin.js`;

	term.fullscreen(true);
	term.styleReset();
	term.windowTitle("Ittai");
	term.table([["\n  Ittai Plugin Builder  \n"]], {
		hasBorder: true,
		contentHasMarkup: false,
		borderChars: "heavy",
		borderAttr: { color: "green" },
		textAttr: { bgColor: "default" },
		width: "\n  Ittai Plugin Builder  \n".length,
		fit: true,
	});

	let argsTable = [];

	argsTable.push(["Plugin Folder:", path.resolve(argv.plugin)]);
	if (argv.betterdiscord)
		argsTable.push([
			"BetterDiscord Plugin File:",
			path.resolve(path.join(argv.betterdiscord, bdFileName)),
		]);
	if (argv.powercordv2)
		argsTable.push([
			"PowercordV2 Plugin Folder:",
			path.resolve(argv.powercordv2),
		]);
	if (argv.vizality)
		argsTable.push(["Vizality Plugin Folder:", path.resolve(argv.vizality)]);
	argsTable.push(["Watching Files:", argv.watch ? "true" : "false"]);
	argsTable.push(["Build for Production:", argv.production ? "true" : "false"]);
	term.table(argsTable, {
		hasBorder: false,
		contentHasMarkup: false,
		borderChars: "heavy",
		borderAttr: { color: "green" },
		textAttr: { bgColor: "default" },
		width:
			Math.max(...argsTable.map(([name, value]) => value.length)) +
			Math.max(...argsTable.map(([name, value]) => name.length)) +
			2,
		fit: true,
		firstColumnTextAttr: { color: "green" },
	});

	term.hideCursor();
};
