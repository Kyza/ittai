module.exports = class FunctionQueue {
	constructor(options) {
		this.autostart = options.autostart ?? false;
		this.functions = options.functions ?? [];
		if (this.autostart && this.functions.length > 0) this.next();
	}

	push(funct) {
		const wasEmpty = this.functions.length == 0;
		if (typeof funct != "function") throw "`push` requires a function.";
		this.functions.push(funct);
		if (this.autostart && wasEmpty && !this.running) this.next();
	}

	next() {
		if (this.functions.length > 0) {
			this.running = true;
			const runNext = () => {
				if (this.autostart) {
					// Break call stack probably not idk.
					setImmediate(() => {
						this.functions.splice(0, 1);
						this.functions.length > 0 ? this.next() : (this.running = false);
					});
				}
			};
			!this.functions[0]()?.then?.(runNext) instanceof Promise ? runNext() : 0;
		}
	}
};
