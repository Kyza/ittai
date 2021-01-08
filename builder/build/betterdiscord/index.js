const fs = require("fs-extra");
const path = require("path");

module.exports = (code, fromPath) => {
	// Generate BD meta.
	const manifest = fs.readJSONSync(path.join(fromPath, "manifest.json"));
	let meta = "/**";
	for (const key in manifest) {
		meta += `\n * @${key} ${
			key === "name" ? manifest[key].replace(/ /g, "") : manifest[key]
		}`;
	}
	meta += "\n */";
	return `${meta}\n${code}`;
};
