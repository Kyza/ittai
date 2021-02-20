/**
 * @module patcher
 */

/**
 * A list of the currently patched components.
 */
export let patches = {};

export { default as before } from "./before";
export { default as instead } from "./instead";
export { default as after } from "./after";
export { default as unpatchAll } from "./unpatchAll";
export { default as patch } from "./patch";
