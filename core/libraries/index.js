/** @module libraries */

import { getByProps } from "../webpack/modules";

/**
 * Discord's {@link https://reactjs.org/|React} instance.
 */
export const React = getByProps("useState");
/**
 * Discord's {@link https://reactjs.org/docs/react-dom.html|ReactDOM} instance.
 */
export const ReactDOM = getByProps("render", "unmountComponentAtNode");
/**
 * Discord's {@link https://lodash.com/|Lodash} instance.
 */
export const Lodash = globalThis._;
