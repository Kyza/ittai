const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
// const stripComments = require("strip-comments");
const beautify = require("js-beautify").js;

const build = (fromPath, toPath, callback) => {
	console.log(`Building ${path.resolve(fromPath)} to ${path.resolve(toPath)}.`);
	console.time("Bulit in");
	fs.ensureDir(toPath);
	webpack(
		{
			mode: "production",
			target: "node",
			entry: path.resolve(fromPath),
			output: {
				library: "LibraryPluginHack",
				libraryTarget: "commonjs2",
				filename: "index.js",
				path: path.resolve(toPath),
			},
			externals: [
				function ({ context, request }, callback) {
					if (/^(electron|fs|path|powercord.*|@vizality.*)$/.test(request)) {
						// Externalize to a commonjs module using the request path
						return callback(null, "commonjs2 " + request);
					}

					// Continue without externalizing the import
					callback();
				},
			],
			resolve: {
				extensions: [".js"],
			},
			optimization: {
				minimize: false,
			},
			module: {
				rules: [
					{
						test: /\.css$/i,
						use: [
							{
								loader: "style-loader",
								options: { injectType: "lazyStyleTag" },
							},
							"css-loader",
						],
					},
					{
						test: /\.scss$/i,
						use: [
							{
								loader: "style-loader",
								options: { injectType: "lazyStyleTag" },
							},
							"css-loader",
							"sass-loader",
						],
					},
					{
						test: /\.styl$/i,
						use: [
							{
								loader: "style-loader",
								options: { injectType: "lazyStyleTag" },
							},
							"css-loader",
							"stylus-loader",
						],
					},
					{
						test: /\.less$/i,
						use: [
							{
								loader: "style-loader",
								options: { injectType: "lazyStyleTag" },
							},
							"css-loader",
							"less-loader",
						],
					},
					{
						test: /\.m?(j|t)sx?$/i,
						exclude: /node_modules/,
						use: {
							loader: "@sucrase/webpack-loader",
							options: {
								production: true,
								enableLegacyBabel5ModuleInterop: true,
								transforms: ["jsx", "typescript", "imports"],
							},
						},
					},
					{
						test: /\.coffee?$/i,
						exclude: /node_modules/,
						use: {
							loader: "coffee-loader",
						}, // cool not gonna test it have fun square
					},
				],
			},
		},
		(err, stats) => {
			if (err || stats.hasErrors()) {
				console.error(err);
			}

			const outputPath = path.join(path.resolve(toPath), "index.js");
			let builtCode = fs.readFileSync(outputPath, "utf-8");

			builtCode = builtCode.replace(
				"module.exports.LibraryPluginHack",
				"let plugin"
			);

			// Add clientmod-specific code.
			builtCode = callback(builtCode);

			builtCode += "module.exports = plugin;";

			builtCode = beautify(builtCode, {
				indent_with_tabs: true,
			});

			// Get rid of ugly blank lines.
			builtCode = builtCode.replace(/\n{2,}/g, "\n");

			fs.writeFileSync(outputPath, builtCode);
			console.timeEnd("Bulit in");
		}
	);
};

module.exports = (argv) => {
	if (fs.existsSync(argv.build)) {
		if (argv.core && fs.existsSync(argv.core)) {
			fs.copySync(
				argv.core,
				path.join(argv.build, "ittai"),
				{ overwrite: true },
				() => {}
			);
		}

		build(argv.build, argv.to, (code) => {
			if (argv.powercordv2) {
				code = require("./powercordv2")(code);
			}
			if (argv.vizality) {
				code = require("./vizality")(code);
			}
			if (argv.betterdiscord) {
				code = require("./betterdiscord")(code, argv.build);
			}
			return code;
		});
	}
};
