import { _components, componentsHandler } from "../components";

/**
 * A {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/|Proxy} of all React components in Discord's Webpack modules.
 * @name all
 * @type {Proxy}
 * @memberof module:webpack/components
 * @example
 * const {MiniPopover, Text} = ittai.webpack.components.all;
 */
export default new Proxy(_components, componentsHandler);
