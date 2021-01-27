```js
const obj = {
	f: () => {
		console.log("x");
	},
};

/*
 * x
 */
obj.f();

// Patch the function and save the patch for later.
const insteadPatch = ittai.utils.patcher.instead("patch-test", obj, "f", () => {
	console.log("Instead patch!");
});

/*
 * Instead patch!
 */
obj.f();

// Unpatch the function.
insteadPatch.unpatch();

/*
 * x
 */
obj.f();
```
