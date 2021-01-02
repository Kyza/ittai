const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const stripComments = require("strip-comments");
const beautify = require("js-beautify").js;

module.exports = (argv) => {
	console.log(
		`Building ${path.resolve(argv.build)} to ${path.resolve(argv.powercordv2)}.`
	);
	console.time("Bulit in");
	fs.copySync(
		argv.core,
		path.join(argv.build, "ittai"),
		{ overwrite: true },
		() => {}
	);
	webpack(
		{
			mode: "production",
			target: "node",
			entry: path.resolve(argv.build),
			experiments: {
				// outputModule: true,
			},
			output: {
				library: "LibraryPluginHack",
				libraryTarget: "commonjs2",
				filename: "index.js",
				path: path.resolve(argv.powercordv2),
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
				extensions: [".js"], // because it still doesnt load anyway lmao
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
					}, // there this probably all works
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

			const outputPath = path.join(path.resolve(argv.powercordv2), "index.js");
			let builtCode = fs.readFileSync(outputPath, "utf-8");

			builtCode = builtCode.replace(
				"module.exports.LibraryPluginHack",
				"let plugin"
			);
			builtCode +=
				"\nplugin.prototype.onStart = plugin.prototype.start;plugin.prototype.onStop = plugin.prototype.stop;module.exports = plugin;";

			builtCode = beautify(builtCode, {
				indent_with_tabs: true,
			});

			builtCode = builtCode.replace(/\n{2,}/g, "\n");

			fs.writeFileSync(outputPath, builtCode);
			console.timeEnd("Bulit in");
		}
	);
};
