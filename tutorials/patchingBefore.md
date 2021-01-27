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
const beforePatch = ittai.utils.patcher.before("patch-test", obj, "f", () => {
	console.log("Before patch!");
});

/*
 * Before patch!
 * x
 */
obj.f();

// Unpatch the function.
beforePatch.unpatch();

/*
 * x
 */
obj.f();
```
