import * as patcher from "../patcher";
import { modules } from "../webpack";
import { randomString, findInTree, findInReactTree } from "../utilities";

const CommandsModule = modules.getByProps("BUILT_IN_COMMANDS");
const ApplicationCommandDiscoveryApplicationIcon = modules.getByDisplayName(
	"ApplicationCommandDiscoveryApplicationIcon"
);

let iconPatch;

export function patchIcons() {
	if (!iconPatch) {
		iconPatch = patcher.after(
			"Ittai-ApplicationCommandDiscoveryApplicationIcon-before",
			ApplicationCommandDiscoveryApplicationIcon,
			"default",
			(that, args, res) => {
				const props = findInReactTree(res, (n) => n.src);
				const section = findInTree(args, (n) => n.icon);

				if (!props || !section || props.src.indexOf(section.icon) > 0)
					return res;

				res.props.onClick = () => {};
				props.src = section.icon;

				return res;
			}
		);
	}
}

export function unpatchIcons() {
	iconPatch.unpatch();
	iconPatch = null;
}

export const COMMAND_ARGUMENT_TYPES = {
	SUB_COMMAND: 1,
	SUB_COMMAND_GROUP: 2,
	STRING: 3,
	INTEGER: 4,
	BOOLEAN: 5,
	USER: 6,
	CHANNEL: 7,
	ROLE: 8,
};

export let registeredCommands = [];
export let registeredSections = [];

/**
 *
 * @param {object} id
 */
export function registerCommand(command) {
	patchIcons();
	const currentIDs = CommandsModule.BUILT_IN_COMMANDS.map(({ id }) => id);
	if (!command.id ?? false) command.id = randomString(10, currentIDs);
	if (currentIDs.indexOf(command.id) > -1)
		command.id += randomString(10, currentIDs);

	command.applicationId = command.applicationId ?? "-1";
	command.execute = command.execute ?? (() => {});

	CommandsModule.BUILT_IN_COMMANDS.push(command);
	registeredCommands.push(command.id);
	return command.id;
}

export function unregisterCommand(id) {
	CommandsModule.BUILT_IN_COMMANDS.splice(
		CommandsModule.BUILT_IN_COMMANDS.findIndex((command) => command.id === id),
		1
	);
}
export function unregisterAllCommands() {
	for (const command of registeredCommands) {
		unregisterCommand(command);
	}
}

/**
 *
 * @param {object} id
 */
export function registerSection(section) {
	patchIcons();
	const currentIDs = CommandsModule.BUILT_IN_SECTIONS.map(({ id }) => id);
	if (!section.id ?? false) section.id = randomString(10, currentIDs);
	if (currentIDs.indexOf(section.id) > -1)
		section.id += randomString(10, currentIDs);

	section.isBuiltIn = false;

	CommandsModule.BUILT_IN_SECTIONS.push(section);
	registeredSections.push(section.id);
	return section.id;
}

export function unregisterSection(id) {
	CommandsModule.BUILT_IN_COMMANDS.splice(
		CommandsModule.BUILT_IN_COMMANDS.findIndex((command) => command.id === id),
		1
	);
}
export function unregisterAllSections() {
	for (const command of registeredSections) {
		unregisterCommand(command);
	}
}
