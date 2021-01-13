import * as ittai from "ittai";
globalThis.ittai = ittai;

import { React } from "ittai/libraries";
import { Plugin } from "ittai/entities";
import { modules, classes } from "ittai/webpack";
import { all as components } from "ittai/webpack/components";
import { multiBenchmark } from "ittai/utils";

const Text = components.Text;
const SwitchItem = components.SwitchItem;
const Tooltip = components.Tooltip;

export default class TestPlugin extends Plugin {
	start() {
		this.log("Starting.");

		let vzw, pcw;

		try {
			vzw = require("@vizality/webpack");
		} catch {}
		try {
			pcw = require("powercord/webpack");
		} catch {}

		multiBenchmark(
			[
				{
					IttaiClass: () => {
						return classes.getByNames("message", "scroller");
					},
				},
				{
					IttaiModule: () => {
						return modules.getByProps("message", "scroller");
					},
				},
				{
					ZLibraryModule: () => {
						return ZLibrary.WebpackModules.getByProps("message", "scroller");
					},
				},
				{
					PowercordModule: () => {
						return pcw.getModule(["message", "scroller"], false);
					},
				},
				{
					VizalityModule: () => {
						return vzw.getModule("message", "scroller");
					},
				},
				{
					BdApiModule: () => {
						return BdApi.findModuleByProps("message", "scroller");
					},
				},
				{
					pre: () => {
						BDFDB.Cache.modules = {};
					},
					BDFDBModule: () => {
						return BDFDB.ModuleUtils.findByProperties("message", "scroller");
					},
				},
			],
			1000
		);
		multiBenchmark(
			[
				{
					IttaiComponent: () => {
						return components.Text;
					},
				},
				{
					ZLibraryComponent: () => {
						return ZLibrary.WebpackModules.getByDisplayName("Text");
					},
				},
				{
					PowercordComponent: () => {
						return pcw.getModuleByDisplayName("Text");
					},
				},
				{
					VizalityComponent: () => {
						return vzw.getModuleByDisplayName("Text");
					},
				},
				{
					BdApiComponent: () => {
						return BdApi.findModuleByDisplayName("Text");
					},
				},
				{
					pre: () => {
						BDFDB.Cache.modules = {};
					},
					BDFDBComponent: () => {
						return BDFDB.ModuleUtils.findByName("Text");
					},
				},
			],
			1000
		);

		this.setSettingsPanel(() => {
			const [on, setOn] = React.useState(this.getSetting("on", false));
			return (
				<>
					<Tooltip color="black" postion="top" text="Tooltip Test">
						{(props) => <Text {...props}>Test settings panel.</Text>}
					</Tooltip>
					<SwitchItem
						value={on}
						onChange={(event) => {
							this.setSetting("on", event);
							setOn(this.getSetting("on"));
						}}
						note="Flip switch save settings."
					>
						Flippy Flippy Switch
					</SwitchItem>
				</>
			);
		});
	}

	stop() {
		this.removeSettingsPanel();
		this.log("Stopping.");
	}
}
