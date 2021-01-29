import * as ittai from "ittai";
globalThis.ittai = ittai;

import { React } from "ittai/libraries";
import { Plugin } from "ittai/entities";
import { components, modules } from "ittai/webpack";
import * as patcher from "ittai/patcher";
import { findInReactTree, fetchMessage } from "ittai/utils";

import PersonalPinsList from "./components/PersonalPinsList";
import Settings from "./components/Settings";
import PinButton from "./components/PinButton";
import PinsHeader from "./components/PinsHeader";

const MiniPopover = modules.getByDisplayName("MiniPopover");
const MessagesPopout = modules.getByDisplayName("MessagesPopout");

const { getChannel } = modules.getByProps("getChannel");

export default class PersonalPins extends Plugin {
	start() {
		this.log("Starting.");

		this.miniPopoverAfter = patcher.after(
			"PersonalPins-MiniPopover-default",
			MiniPopover,
			"default",
			(that, args, res) => {
				const props = findInReactTree(res, (n) => n.message);
				if (!props) return res;
				const message = fetchMessage(props.channel.id, props.message.id);
				const channel = getChannel(props.channel.id);

				res.props.children.unshift(
					<PinButton
						settings={this.settings}
						message={message}
						channel={channel}
					/>
				);
				return res;
			}
		);

		this.messagesPopoutAfter = patcher.after(
			"PersonalPins-MessagesPopout-default",
			MessagesPopout,
			"default",
			(that, args, res) => {
				delete res.props.children[0].props.title;
				res.props.children[0].props.children = [
					<PinsHeader settings={this.settings} />,
				];

				switch (this.settings.get("pinsTab")) {
					case "personal":
						res.props.children[1] = (
							<PersonalPinsList settings={this.settings} />
						);
						res.props.children.splice(2, 1);
						break;
				}
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
