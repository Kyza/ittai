const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { argv } = yargs(hideBin(process.argv));

const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const beautify = require("js-beautify").js;
const isValidPath = require("is-valid-path");
const core = path.resolve(path.join("./core"));
const term = require("terminal-kit").terminal;

const bdFileName = `${fs
	.readJSONSync(path.join(argv.plugin, "manifest.json"))
	.name.replace(/ /g, "")}.plugin.js`;

function nanoseconds() {
	const hrTime = process.hrtime();
	return hrTime[0] * 1000000000 + hrTime[1];
}

const { header } = require("../ui");

let startTime;
let error = false;

function build(argv, forceNoWatch = false) {
	return new Promise((resolve) => {
		if (fs.existsSync(argv.plugin) && fs.existsSync(core)) {
			term.eraseDisplay();
			header(argv);

			fs.ensureFileSync("./temp/index.js");
			fs.ensureFileSync("./temp/manifest.json");
			const temp = path.resolve("./temp");

			const stylesheetLoader = path.resolve(
				path.join(__dirname, "stylesheetLoader.js")
			);
			const jsBuilder = argv.production
				? {
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/env",
									{
										targets: {
											electron: "12",
										},
									},
								],
								"@babel/react",
								["@babel/typescript", { esModuleInterop: true }],
							],
							plugins: [
								"@babel/plugin-proposal-class-properties",
								"minify-dead-code-elimination",
							],
						},
				  }
				: {
						loader: "@sucrase/webpack-loader",
						options: {
							production: true,
							// enableLegacyBabel5ModuleInterop: true,
							transforms: ["jsx", "typescript", "imports"],
						},
				  };
			const progressBar = term.progressBar({
				width: Math.round(term.width / 2),
				title: "Building:",
				eta: false,
				percent: false,
				barStyle: term.green,
				percentStyle: term.green,
				barChar: "~",
				barHeadChar: ">",
			});
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
					watch: forceNoWatch ? false : argv.watch,
					watchOptions: {
						followSymlinks: true,
						ignored: [
							"/node_modules/",
							"/builder/",
							"/docs/",
							"/media/",
							"/tutorials/",
						],
					},
					plugins: [
						new webpack.ProgressPlugin((percentage, message, ...args) => {
							if (percentage === 0) {
								startTime = nanoseconds();
								error = false;
								term.eraseDisplay();
								header(argv);
							}
							progressBar.update({
								progress: percentage,
							});
							if (percentage === 1) {
								term.eraseLine();

								if (error) {
									errored = true;
									const info = error.stats.toJson();
									if (error.stats.hasErrors()) {
										for (const error of info.errors)
											term.red(error.message + "\n");
									}
									if (error.stats.hasWarnings()) {
										for (const warning of info.warnings)
											term.red(warning.message + "\n");
									}
									term("Build failed after ")
										.red(
											Math.round(
												(nanoseconds() - startTime) / 1000
											).toLocaleString()
										)
										.styleReset("ms.\n");
									term.hideCursor();
									return resolve();
								}

								term("Built in ")
									.brightGreen(
										Math.round(
											(nanoseconds() - startTime) / 1000
										).toLocaleString()
									)
									.styleReset("ms.\n");
								if (!argv.watch) {
									term.fullscreen(false);
									process.exit();
								}
								term.hideCursor();

								resolve();
							}
						}),
						// new webpack.ProvidePlugin({
						// 	React: path.resolve(core, "libraries", "React.js"),
						// }),
					],
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
						extensions: [
							".js",
							".jsx",
							".ts",
							".tsx",
							".coffee",
							".css",
							".scss",
							".sass",
							".less",
							".styl",
						],
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
										max_line_len: false,
										semicolons: true,
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
								use: jsBuilder,
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
					if (stats.hasErrors()) error = { err, stats };

					const outputPath = path.join(path.resolve("./temp"), "index.js");
					let builtCode = fs.readFileSync(outputPath, "utf-8");

					builtCode = builtCode.replace(
						"module.exports.LibraryPluginHack",
						"let plugin"
					);

					builtCode += "plugin = plugin.default;";

					// Add clientmod-specific code.
					if (argv.powercordv2) builtCode = require("./powercordv2")(builtCode);
					if (argv.vizality) builtCode = require("./vizality")(builtCode);
					if (argv.betterdiscord)
						builtCode = require("./betterdiscord")(builtCode, argv.plugin);

					builtCode += "module.exports = plugin;";

					builtCode = beautify(builtCode, {
						indent_with_tabs: true,
					});

					// Get rid of ugly blank lines.
					builtCode = builtCode.replace(/\n{2,}/g, "\n");

					fs.writeFileSync(outputPath, builtCode);

					fs.copyFileSync(
						path.join(argv.plugin, "manifest.json"),
						path.join(temp, "manifest.json")
					);

					if (isValidPath(argv.vizality)) {
						fs.ensureDirSync(argv.vizality);
						fs.copy(temp, argv.vizality);
					}
					if (isValidPath(argv.powercordv2)) {
						fs.ensureDirSync(argv.powercordv2);
						fs.copy(temp, argv.powercordv2);
					}
					if (fs.existsSync(argv.betterdiscord)) {
						fs.copyFileSync(
							path.resolve(path.join(temp, "index.js")),
							path.join(argv.betterdiscord, bdFileName)
						);
					}
				}
			);
		}
	});
}

module.exports = build;
