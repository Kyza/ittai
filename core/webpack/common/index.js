/**
 * {@link https://discord.com/acknowledgements/|Full list of libraries that Discord uses.}
 * @module webpack/common
 */

import { modules } from "..";

export /**
 * Discord's {@link https://reactjs.org/|React} instance.
 * @memberof module:webpack/common
 */ const React = modules.getByProps("useState");

export /**
 * Discord's {@link https://reactjs.org/docs/react-dom.html|ReactDOM} instance.
 * @memberof module:webpack/common
 */ const ReactDOM = modules.getByProps("render", "unmountComponentAtNode");

export /**
 * Discord's {@link https://reactjs.org/|React} instance.
 * @memberof module:webpack/common
 */ const ReactSpring = modules.getByProps("useState");

export /**
 * Discord's {@link https://lodash.com/|Lodash} instance.
 * @memberof module:webpack/common
 */ const Lodash = globalThis._;

export /**
 * Discord's modal stack.
 * @memberof module:webpack/common
 */ const ModalStack = modules.getByProps(
	"push",
	"update",
	"pop",
	"popWithKey"
);
