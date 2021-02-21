import * as ittai from "ittai";
// globalThis.ittai = ittai;

import { React } from "ittai/webpack/common";
import { Plugin } from "ittai/entities";
import { components } from "ittai/webpack";
import * as patcher from "ittai/patcher";
import { findInReactTree } from "ittai/utilities";

import Settings from "./components/Settings";

const { LazyImageZoomable } = components.all;

export default class ScrumptiousMedia extends Plugin {
	start() {
		this.log("Starting.");

		patcher.after(
			"ScrumptiousMedia-LazyImageZoomable-render",
			LazyImageZoomable.prototype,
			"render",
			(that, args, res) => {
				const props = findInReactTree(res, (node) => node.onZoom);
				if (!props) return res;
				this.log(that, args, res);
				props.onZoom = (event, { placeholder }) => {
					this.log(event, placeholder);
				};
				return res;
			}
		);

		this.settings.setPanel(<Settings />);
	}
	stop() {
		this.log("Stopping.");
		this.settings.removePanel();
		patcher.unpatchAll();
	}
}
