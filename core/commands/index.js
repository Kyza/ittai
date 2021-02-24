import { modules } from "ittai/webpack";
import { randomString } from "ittai/utilities";
import { commands } from "..";

const CommandsModule = modules.getByProps("BUILT_IN_COMMANDS");

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

/**
 *
 * @param {object} id
 */
export function registerCommand(command) {
	const currentIDs = CommandsModule.BUILT_IN_COMMANDS.map(({ id }) => id);
	if (command.id ?? true) command.id = randomString(10, currentIDs);
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
