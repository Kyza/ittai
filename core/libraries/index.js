import { getByProps } from "../webpack/modules";
import { getByProps } from "../webpack/modules";

export const React = getByProps("useState");
export const ReactDOM = getByProps("render", "unmountComponentAtNode");
export const lodash = globalThis._;
