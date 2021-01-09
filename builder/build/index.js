const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const beautify = require("js-beautify").js;
const chokidar = require("chokidar");

const core = path.resolve(path.join("./core"));

const build = (argv, callback) => {
	console.log(`Building ${path.resolve(argv.plugin)}.`);

	fs.ensureDirSync("./temp");
	const temp = path.resolve("./temp");

	const stylesheetLoader = path.resolve(
		path.join(__dirname, "stylesheetLoader.js")
	);
	webpack(
		{
			mode: "production",
			target: "node",
			entry: path.resolve(argv.plugin),
			output: {
				library: "LibraryPluginHack",
				libraryTarget: "commonjs2",
				filename: "index.js",
				path: temp,
			},
			externals: [
				function ({ context, request }, callback) {
					if (/^(electron|powercord.*|@vizality.*)$/.test(request)) {
						// Externalize to a commonjs module using the request path
						return callback(null, "commonjs2 " + request);
					}

					// Continue without externalizing the import
					callback();
				},
			],
			resolve: {
				extensions: [".js"],
				alias: {
					ittai: path.resolve(core),
				},
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							module: true,
							compress: {
								defaults: false,
							},
							mangle: false,
							parse: {},
							rename: {},
							format: {
								comments: false,
								max_line_len: true,
								semicolons: false,
								beautify: true,
							},
						},
					}),
				],
			},
			module: {
				rules: [
					{
						test: /\.css$/i,
						use: [stylesheetLoader, "css-loader"],
					},
					{
						test: /\.s[ac]ss$/i,
						use: [
							stylesheetLoader,
							{
								loader: "css-loader",
								options: {
									modules: true,
								},
							},
							"sass-loader",
						],
					},
					{
						test: /\.styl$/i,
						use: [
							stylesheetLoader,
							{
								loader: "css-loader",
								options: {
									modules: true,
								},
							},
							"stylus-loader",
						],
					},
					{
						test: /\.less$/i,
						use: [
							stylesheetLoader,
							{
								loader: "css-loader",
								options: {
									modules: true,
								},
							},
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
				return console.error("Build failed.", err);
			}

			const outputPath = path.join(path.resolve("./temp"), "index.js");
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

			if (fs.existsSync(argv.vizality)) {
				fs.copy(temp, argv.vizality);
			}
			if (fs.existsSync(argv.powercordv2)) {
				fs.copy(temp, argv.powercordv2);
			}
			if (fs.existsSync(argv.betterdiscord)) {
				fs.copyFile(
					path.resolve(path.join(temp, "index.js")),
					path.join(
						argv.betterdiscord,
						`${fs
							.readJSONSync(path.join(argv.plugin, "manifest.json"))
							.name.replace(/ /g, "")}.plugin.js`
					)
				);
			}
		}
	);
};

const beginBuild = (argv) => {
	if (fs.existsSync(argv.plugin) && fs.existsSync(core)) {
		if (fs.existsSync(argv.vizality)) {
			fs.ensureDirSync(argv.vizality);
			fs.copyFileSync(
				path.join(argv.plugin, "manifest.json"),
				path.join(argv.vizality, "manifest.json")
			);
		}
		if (fs.existsSync(argv.powercordv2)) {
			fs.ensureDirSync(argv.powercordv2);
			fs.copyFileSync(
				path.join(argv.plugin, "manifest.json"),
				path.join(argv.powercordv2, "manifest.json")
			);
		}

		build(argv, (code) => {
			if (argv.powercordv2) {
				code = require("./powercordv2")(code);
			}
			if (argv.vizality) {
				code = require("./vizality")(code);
			}
			if (argv.betterdiscord) {
				code = require("./betterdiscord")(code, argv.plugin);
			}
			return code;
		});
	}
};

module.exports = (argv) => {
	if (argv.watch) {
		beginBuild(argv);
		chokidar
			.watch([argv.plugin, core], {
				persistent: true,
				ignoreInitial: true,
			})
			.on("all", (event, path) => {
				beginBuild(argv);
			});
	} else {
		beginBuild(argv);
	}
};
