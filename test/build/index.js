/**
 * @name testbundle
 * @version 1.0.0
 * @description Shaky Shalky audi fjvhdbksfdvgbhjk
 * @author Kyza
 * @icon icon/icon.png
 * @license None
 */
let plugin =
	/******/
	(() => { // webpackBootstrap
		/******/
		"use strict";
		/******/
		var __webpack_modules__ = ({
			/***/
			21:
				/***/
				((module, exports, __webpack_require__) => {
					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : {
							default: obj
						};
					}
					var _entities = __webpack_require__(706);
					var _webpack = __webpack_require__(384);
					var _logger = __webpack_require__(365);
					var _logger2 = _interopRequireDefault(_logger);
					var _stylecss = __webpack_require__(247);
					var _stylecss2 = _interopRequireDefault(_stylecss);
					const {
						getChannelId
					} = _webpack.getModule.call(void 0, "getLastSelectedChannelId");
					class TestPlugin extends _entities.Plugin {
						start() {
							this.log("Starting.", getChannelId());
							_stylecss2.default.use();
							_logger2.default.log("Test");
						}
						stop() {
							this.log("Stopping.");
							_stylecss2.default.unuse();
						}
					}
					exports.default = TestPlugin;
					module.exports = exports.default;
					/***/
				}),
			/***/
			706:
				/***/
				((module, exports, __webpack_require__) => {
					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : {
							default: obj
						};
					}
					var _logger = __webpack_require__(365);
					var _logger2 = _interopRequireDefault(_logger);
					var _utils = __webpack_require__(984);
					exports.default = {
						/**
						 * Get the Plugin class.
						 *
						 * @return {class} Plugin class.
						 */
						get Plugin() {
							switch (_utils.getClientMod.call(void 0, )) {
								case "powercord":
									return __webpack_require__(708).Plugin;
								case "vizality":
									return __webpack_require__(604).Plugin;
								default:
									return class Plugin {
										log() {
											_logger2.default.log(...arguments);
										}
										debug() {
											_logger2.default.debug(...arguments);
										}
										warn() {
											_logger2.default.warn(...arguments);
										}
										error() {
											_logger2.default.error(...arguments);
										}
									};
							}
						},
					};
					module.exports = exports.default;
					/***/
				}),
			/***/
			984:
				/***/
				((__unused_webpack_module, exports, __webpack_require__) => {
					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					function _interopRequireWildcard(obj) {
						if (obj && obj.__esModule) {
							return obj;
						} else {
							var newObj = {};
							if (obj != null) {
								for (var key in obj) {
									if (Object.prototype.hasOwnProperty.call(obj, key)) {
										newObj[key] = obj[key];
									}
								}
							}
							newObj.default = obj;
							return newObj;
						}
					}
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : {
							default: obj
						};
					}
					var _patcher = __webpack_require__(363);
					var _patcher2 = _interopRequireWildcard(_patcher);
					exports.patcher = _patcher2;
					var _logger = __webpack_require__(365);
					var _logger2 = _interopRequireWildcard(_logger);
					exports.logger = _logger2;
					// Know it will work on this client mod or it's detecting the wrong one?
					// Set this variable.
					let clientMod;
					function getClientMod() {
						if (clientMod) return clientMod;
						if (globalThis.BdApi) {
							return (clientMod = "betterdiscord");
						} else if (globalThis.EdApi) {
							return (clientMod = "enhanceddiscord");
						} else if (globalThis.powercord) {
							return (clientMod = "powercord");
						} else if (globalThis.vizality) {
							return (clientMod = "vizality");
						} else if (globalThis.untitled) {
							throw Error("Untitled is not supported yet.");
						} else if (globalThis.nxt) {
							throw Error("How the hell did you get this client mod.");
						}
						throw Error("Unknown client mod.");
					}
					exports.getClientMod = getClientMod;
					/***/
				}),
			/***/
			365:
				/***/
				((module, exports) => {
					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					function createArguments(...args) {
						return [
							"%cIttai",
							"color: #000; background-color: #42ffa7; font-family: default; padding-left: 3px; padding-right: 3px; border-radius: 2px; font-weight: bold;",
							...args,
						];
					}
					exports.default = {
						log: (...args) => {
							console.log(...createArguments(...args));
						},
						debug: (...args) => {
							console.debug(...createArguments(...args));
						},
						warn: (...args) => {
							console.warn(...createArguments(...args));
						},
						error: (...args) => {
							console.error(...createArguments(...args));
						},
					};
					module.exports = exports.default;
					/***/
				}),
			/***/
			363:
				/***/
				((module, exports, __webpack_require__) => {
					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : {
							default: obj
						};
					}
					var _logger = __webpack_require__(365);
					var _logger2 = _interopRequireDefault(_logger);
					function dirtyObject(object) {
						if (!object.__ittaiPatches__) object.__ittaiPatches__ = [];
					}
					function cleanObject(object) {
						if (object.__ittaiPatches__) delete object.__ittaiPatches__;
					}
					exports.default = {
						patch: function(object, name, type, patch) {
							dirtyObject(object);
							const patchData = {
								type,
								name,
								patch,
								original: {
									...object
								} [name],
								unpatch: function() {
									try {
										if (object.__ittaiPatches__.indexOf(this) === -1)
											throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
										object.__ittaiPatches__.splice(
											object.__ittaiPatches__.indexOf(this),
											1
										);
										if (object.__ittaiPatches__.length === 0) cleanObject(object);
									} catch (e) {
										_logger2.default.error("Failed to unpatch.", e);
									}
								},
							};
							object.__ittaiPatches__.push(patchData);
							object[name] = (...args) => {
								const befores = object.__ittaiPatches__.filter(
									(p) => p.type === "before"
								);
								const insteads = object.__ittaiPatches__.filter(
									(p) => p.type === "instead"
								);
								const afters = object.__ittaiPatches__.filter((p) => p.type === "after");
								// Before patches.
								for (const before of befores) {
									try {
										args = before.patch(args);
									} catch (e) {
										_logger2.default.error("Error running before patch.", e);
									}
								}
								// Instead patches.
								let res = {};
								if (insteads.length === 0) {
									try {
										res = patchData.original(...args);
									} catch (e) {
										_logger2.default.error("Error running instead patch.", e);
									}
								} else {
									// Bad, fix later.
									for (const instead of insteads) {
										// Do trash merge with Lodash.
										try {
											res = globalThis._.merge(res, instead.patch(args));
										} catch (e) {
											_logger2.default.error("Error running instead patch.", e);
										}
									}
								}
								// After patches.
								for (const after of afters) {
									try {
										res = after.patch(args, res);
									} catch (e) {
										_logger2.default.error("Error running after patch.", e);
									}
								}
								return res;
							};
							return patchData;
						},
					};
					module.exports = exports.default;
					/***/
				}),
			/***/
			384:
				/***/
				((module, exports, __webpack_require__) => {
					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					var _utils = __webpack_require__(984);
					exports.default = {
						getModule(...args) {
							switch (_utils.getClientMod.call(void 0, )) {
								case "powercord":
									return __webpack_require__(691).getModule(args, false);
								case "vizality":
									return __webpack_require__(827).getModule(...args);
								case "betterdiscord":
									if (typeof args[0] === "function") {
										return BdApi.findModule(args[0]);
									}
									return BdApi.findModuleByProps(...args);
							}
						},
						getModuleByDisplayName(args) {
							switch (_utils.getClientMod.call(void 0, )) {
								case "powercord":
									return __webpack_require__(691).getModuleByDisplayName(args, false);
								case "vizality":
									return __webpack_require__(827).getModuleByDisplayName(args);
								case "betterdiscord":
									return BdApi.findModuleByDisplayName(args);
							}
						},
					};
					module.exports = exports.default;
					/***/
				}),
			/***/
			660:
				/***/
				((module, __webpack_exports__, __webpack_require__) => {
					/* harmony export */
					__webpack_require__.d(__webpack_exports__, {
						/* harmony export */
						"Z": () => __WEBPACK_DEFAULT_EXPORT__
						/* harmony export */
					});
					/* harmony import */
					var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
					/* harmony import */
					var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
					// Imports
					var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i) {
						return i[1]
					});
					// Module
					___CSS_LOADER_EXPORT___.push([module.id, "div {\n\tcolor: red;\n}\n", ""]);
					// Exports
					/* harmony default export */
					const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);
					/***/
				}),
			/***/
			645:
				/***/
				((module) => {
					/*
					  MIT License http://www.opensource.org/licenses/mit-license.php
					  Author Tobias Koppers @sokra
					*/
					// css base code, injected by the css-loader
					// eslint-disable-next-line func-names
					module.exports = function(cssWithMappingToString) {
						var list = []; // return the list of modules as css string
						list.toString = function toString() {
							return this.map(function(item) {
								var content = cssWithMappingToString(item);
								if (item[2]) {
									return "@media ".concat(item[2], " {").concat(content, "}");
								}
								return content;
							}).join('');
						}; // import a list of modules into the list
						// eslint-disable-next-line func-names
						list.i = function(modules, mediaQuery, dedupe) {
							if (typeof modules === 'string') {
								// eslint-disable-next-line no-param-reassign
								modules = [
									[null, modules, '']
								];
							}
							var alreadyImportedModules = {};
							if (dedupe) {
								for (var i = 0; i < this.length; i++) {
									// eslint-disable-next-line prefer-destructuring
									var id = this[i][0];
									if (id != null) {
										alreadyImportedModules[id] = true;
									}
								}
							}
							for (var _i = 0; _i < modules.length; _i++) {
								var item = [].concat(modules[_i]);
								if (dedupe && alreadyImportedModules[item[0]]) {
									// eslint-disable-next-line no-continue
									continue;
								}
								if (mediaQuery) {
									if (!item[2]) {
										item[2] = mediaQuery;
									} else {
										item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
									}
								}
								list.push(item);
							}
						};
						return list;
					};
					/***/
				}),
			/***/
			247:
				/***/
				((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
					__webpack_require__.r(__webpack_exports__);
					/* harmony export */
					__webpack_require__.d(__webpack_exports__, {
						/* harmony export */
						"default": () => __WEBPACK_DEFAULT_EXPORT__
						/* harmony export */
					});
					/* harmony import */
					var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(379);
					/* harmony import */
					var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
					/* harmony import */
					var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(660);
					var refs = 0;
					var update;
					var options = {
						"injectType": "lazyStyleTag"
					};
					options.insert = "head";
					options.singleton = false;
					var exported = {};
					exported.locals = _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__ /* .default.locals */ .Z.locals || {};
					exported.use = function() {
						if (!(refs++)) {
							update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__ /* .default */ .Z, options);
						}
						return exported;
					};
					exported.unuse = function() {
						if (refs > 0 && !--refs) {
							update();
							update = null;
						}
					};
					;
					/* harmony default export */
					const __WEBPACK_DEFAULT_EXPORT__ = (exported);
					/***/
				}),
			/***/
			379:
				/***/
				((module, __unused_webpack_exports, __webpack_require__) => {
					var isOldIE = function isOldIE() {
						var memo;
						return function memorize() {
							if (typeof memo === 'undefined') {
								// Test for IE <= 9 as proposed by Browserhacks
								// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
								// Tests for existence of standard globals is to allow style-loader
								// to operate correctly into non-standard environments
								// @see https://github.com/webpack-contrib/style-loader/issues/177
								memo = Boolean(window && document && document.all && !window.atob);
							}
							return memo;
						};
					}();
					var getTarget = function getTarget() {
						var memo = {};
						return function memorize(target) {
							if (typeof memo[target] === 'undefined') {
								var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself
								if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
									try {
										// This will throw an exception if access to iframe is blocked
										// due to cross-origin restrictions
										styleTarget = styleTarget.contentDocument.head;
									} catch (e) {
										// istanbul ignore next
										styleTarget = null;
									}
								}
								memo[target] = styleTarget;
							}
							return memo[target];
						};
					}();
					var stylesInDom = [];
					function getIndexByIdentifier(identifier) {
						var result = -1;
						for (var i = 0; i < stylesInDom.length; i++) {
							if (stylesInDom[i].identifier === identifier) {
								result = i;
								break;
							}
						}
						return result;
					}
					function modulesToDom(list, options) {
						var idCountMap = {};
						var identifiers = [];
						for (var i = 0; i < list.length; i++) {
							var item = list[i];
							var id = options.base ? item[0] + options.base : item[0];
							var count = idCountMap[id] || 0;
							var identifier = "".concat(id, " ").concat(count);
							idCountMap[id] = count + 1;
							var index = getIndexByIdentifier(identifier);
							var obj = {
								css: item[1],
								media: item[2],
								sourceMap: item[3]
							};
							if (index !== -1) {
								stylesInDom[index].references++;
								stylesInDom[index].updater(obj);
							} else {
								stylesInDom.push({
									identifier: identifier,
									updater: addStyle(obj, options),
									references: 1
								});
							}
							identifiers.push(identifier);
						}
						return identifiers;
					}
					function insertStyleElement(options) {
						var style = document.createElement('style');
						var attributes = options.attributes || {};
						if (typeof attributes.nonce === 'undefined') {
							var nonce = true ? __webpack_require__.nc : 0;
							if (nonce) {
								attributes.nonce = nonce;
							}
						}
						Object.keys(attributes).forEach(function(key) {
							style.setAttribute(key, attributes[key]);
						});
						if (typeof options.insert === 'function') {
							options.insert(style);
						} else {
							var target = getTarget(options.insert || 'head');
							if (!target) {
								throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
							}
							target.appendChild(style);
						}
						return style;
					}
					function removeStyleElement(style) {
						// istanbul ignore if
						if (style.parentNode === null) {
							return false;
						}
						style.parentNode.removeChild(style);
					}
					/* istanbul ignore next  */
					var replaceText = function replaceText() {
						var textStore = [];
						return function replace(index, replacement) {
							textStore[index] = replacement;
							return textStore.filter(Boolean).join('\n');
						};
					}();
					function applyToSingletonTag(style, index, remove, obj) {
						var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE
						/* istanbul ignore if  */
						if (style.styleSheet) {
							style.styleSheet.cssText = replaceText(index, css);
						} else {
							var cssNode = document.createTextNode(css);
							var childNodes = style.childNodes;
							if (childNodes[index]) {
								style.removeChild(childNodes[index]);
							}
							if (childNodes.length) {
								style.insertBefore(cssNode, childNodes[index]);
							} else {
								style.appendChild(cssNode);
							}
						}
					}
					function applyToTag(style, options, obj) {
						var css = obj.css;
						var media = obj.media;
						var sourceMap = obj.sourceMap;
						if (media) {
							style.setAttribute('media', media);
						} else {
							style.removeAttribute('media');
						}
						if (sourceMap && typeof btoa !== 'undefined') {
							css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
						} // For old IE
						/* istanbul ignore if  */
						if (style.styleSheet) {
							style.styleSheet.cssText = css;
						} else {
							while (style.firstChild) {
								style.removeChild(style.firstChild);
							}
							style.appendChild(document.createTextNode(css));
						}
					}
					var singleton = null;
					var singletonCounter = 0;
					function addStyle(obj, options) {
						var style;
						var update;
						var remove;
						if (options.singleton) {
							var styleIndex = singletonCounter++;
							style = singleton || (singleton = insertStyleElement(options));
							update = applyToSingletonTag.bind(null, style, styleIndex, false);
							remove = applyToSingletonTag.bind(null, style, styleIndex, true);
						} else {
							style = insertStyleElement(options);
							update = applyToTag.bind(null, style, options);
							remove = function remove() {
								removeStyleElement(style);
							};
						}
						update(obj);
						return function updateStyle(newObj) {
							if (newObj) {
								if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
									return;
								}
								update(obj = newObj);
							} else {
								remove();
							}
						};
					}
					module.exports = function(list, options) {
						options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
						// tags it will allow on a page
						if (!options.singleton && typeof options.singleton !== 'boolean') {
							options.singleton = isOldIE();
						}
						list = list || [];
						var lastIdentifiers = modulesToDom(list, options);
						return function update(newList) {
							newList = newList || [];
							if (Object.prototype.toString.call(newList) !== '[object Array]') {
								return;
							}
							for (var i = 0; i < lastIdentifiers.length; i++) {
								var identifier = lastIdentifiers[i];
								var index = getIndexByIdentifier(identifier);
								stylesInDom[index].references--;
							}
							var newLastIdentifiers = modulesToDom(newList, options);
							for (var _i = 0; _i < lastIdentifiers.length; _i++) {
								var _identifier = lastIdentifiers[_i];
								var _index = getIndexByIdentifier(_identifier);
								if (stylesInDom[_index].references === 0) {
									stylesInDom[_index].updater();
									stylesInDom.splice(_index, 1);
								}
							}
							lastIdentifiers = newLastIdentifiers;
						};
					};
					/***/
				}),
			/***/
			604:
				/***/
				((module) => {
					module.exports = require("@vizality/core");;
					/***/
				}),
			/***/
			827:
				/***/
				((module) => {
					module.exports = require("@vizality/webpack");;
					/***/
				}),
			/***/
			708:
				/***/
				((module) => {
					module.exports = require("powercord/entities");;
					/***/
				}),
			/***/
			691:
				/***/
				((module) => {
					module.exports = require("powercord/webpack");;
					/***/
				})
			/******/
		});
		/************************************************************************/
		/******/ // The module cache
		/******/
		var __webpack_module_cache__ = {};
		/******/
		/******/ // The require function
		/******/
		function __webpack_require__(moduleId) {
			/******/ // Check if module is in cache
			/******/
			if (__webpack_module_cache__[moduleId]) {
				/******/
				return __webpack_module_cache__[moduleId].exports;
				/******/
			}
			/******/ // Create a new module (and put it into the cache)
			/******/
			var module = __webpack_module_cache__[moduleId] = {
				/******/
				id: moduleId,
				/******/ // no module.loaded needed
				/******/
				exports: {}
				/******/
			};
			/******/
			/******/ // Execute the module function
			/******/
			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
			/******/
			/******/ // Return the exports of the module
			/******/
			return module.exports;
			/******/
		}
		/******/
		/************************************************************************/
		/******/
		/* webpack/runtime/compat get default export */
		/******/
		(() => {
			/******/ // getDefaultExport function for compatibility with non-harmony modules
			/******/
			__webpack_require__.n = (module) => {
				/******/
				var getter = module && module.__esModule ?
					/******/
					() => module['default'] :
					/******/
					() => module;
				/******/
				__webpack_require__.d(getter, {
					a: getter
				});
				/******/
				return getter;
				/******/
			};
			/******/
		})();
		/******/
		/******/
		/* webpack/runtime/define property getters */
		/******/
		(() => {
			/******/ // define getter functions for harmony exports
			/******/
			__webpack_require__.d = (exports, definition) => {
				/******/
				for (var key in definition) {
					/******/
					if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
						/******/
						Object.defineProperty(exports, key, {
							enumerable: true,
							get: definition[key]
						});
						/******/
					}
					/******/
				}
				/******/
			};
			/******/
		})();
		/******/
		/******/
		/* webpack/runtime/hasOwnProperty shorthand */
		/******/
		(() => {
			/******/
			__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
			/******/
		})();
		/******/
		/******/
		/* webpack/runtime/make namespace object */
		/******/
		(() => {
			/******/ // define __esModule on exports
			/******/
			__webpack_require__.r = (exports) => {
				/******/
				if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
					/******/
					Object.defineProperty(exports, Symbol.toStringTag, {
						value: 'Module'
					});
					/******/
				}
				/******/
				Object.defineProperty(exports, '__esModule', {
					value: true
				});
				/******/
			};
			/******/
		})();
		/******/
		/************************************************************************/
		/******/ // module exports must be returned from runtime so entry inlining is disabled
		/******/ // startup
		/******/ // Load entry module and return exports
		/******/
		return __webpack_require__(21);
		/******/
	})();
plugin.prototype.startPlugin = plugin.prototype.start;
plugin.prototype.pluginWillUnload = plugin.prototype.stop;
plugin.prototype.onStart = plugin.prototype.start;
plugin.prototype.onStop = plugin.prototype.stop;
module.exports = plugin;