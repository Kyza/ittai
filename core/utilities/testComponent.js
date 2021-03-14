import { React, ModalStack } from "../webpack/common";

export default function testComponent(Component) {
	ModalStack.push(() => Component);
}
