const fs = require("fs-extra");

module.exports = (argv) => {
	if (fs.existsSync(argv.build)) {
		if (argv.powercordv2) {
			fs.ensureDir(argv.powercordv2);
			require("./powercordv2")(argv);
		}
		if (argv.betterdiscord) {
			require("./betterdiscord")(argv);
		}
	}
};
