import * as ittai from "ittai";
globalThis.ittai = ittai;

import { React } from "ittai/libraries";
import { Plugin } from "ittai/entities";
import { components, modules } from "ittai/webpack";
import * as patcher from "ittai/patcher";
import {
	findInReactTree,
	getOwnerInstance,
	rerenderAllMessages,
} from "ittai/utils";

import ArchiveMessagesList from "./components/ArchiveMessagesList";
import Settings from "./components/Settings";
import ArchiveButton from "./components/ArchiveButton";
// import PinsHeader from "./components/PinsHeader";

const MiniPopover = modules.getByDisplayName("MiniPopover");
const HeaderBar = modules.getByDisplayName("HeaderBar");

export default class ArchiveMessages extends Plugin {
	start() {
		this.log("Starting.");

		patcher.after(
			"ArchiveMessages-MiniPopover-default",
			MiniPopover,
			"default",
			(that, args, res) => {
				const props = findInReactTree(res, (node) => node.message);
				if (!props) return res;
				res.props.children.unshift(
					<ArchiveButton
						settings={this.settings}
						message={props.message}
						channel={props.channel}
					/>
				);
				return res;
			}
		);

		patcher.after(
			"ArchiveMessages-HeaderBar-default",
			HeaderBar,
			"default",
			(that, args, res) => {
				console.log(res);
				return res;
			}
		);

		this.settings.setPanel(<Settings />);

		getOwnerInstance("toolbar")?.forceUpdate();
		rerenderAllMessages();
	}
	stop() {
		this.log("Stopping.");
		this.settings.removePanel();
		patcher.unpatchAll();
		rerenderAllMessages();
	}
}
