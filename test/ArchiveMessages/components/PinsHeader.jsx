import { React } from "ittai/libraries";
import { components, modules, classes } from "ittai/webpack";
import { getOwnerInstance } from "ittai/utils";

const margins = classes.getByNames("marginTop20");

const TabBarModule = modules.getByDisplayName("TabBar");

const { Separator_, TabBar, Header } = components.all;

export default function PinsHeader(props) {
	return (
		<>
			<Header size={Header.Sizes.SIZE_16}>Pinned Messages</Header>
			<Separator_
				className={`${margins.marginBottom8} ${margins.marginTop8}`}
			/>
			<TabBar
				type={TabBarModule.Types.TOP_PILL}
				selectedItem={props.settings.get("pinsTab", "channel")}
				onItemSelect={(item) => {
					props.settings.set({ pinsTab: item });
					getOwnerInstance("messagesPopoutWrap")?.forceUpdate();
				}}
			>
				<TabBarModule.Item id="channel">Channel</TabBarModule.Item>
				<TabBarModule.Item id="personal">Personal</TabBarModule.Item>
			</TabBar>
		</>
	);
}
