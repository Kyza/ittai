const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const beautify = require("js-beautify").js;
const escapeRegExp = require("escape-string-regexp");

const build = (fromPath, toPath, core, callback) => {
	console.log(`Building ${path.resolve(fromPath)} to ${path.resolve(toPath)}.`);
	console.time("Bulit in");
	fs.ensureDir(toPath);

	const stylesheetLoader = path.resolve(
		path.join(__dirname, "stylesheetLoader.js")
	);
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
	if (fs.existsSync(argv.build) && fs.existsSync(argv.core)) {
		if (fs.existsSync(path.join(argv.to, "index.js")))
			fs.unlinkSync(path.join(argv.to, "index.js"));

		build(argv.build, argv.to, argv.core, (code) => {
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
