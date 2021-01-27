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
const afterPatch = ittai.utils.patcher.after("patch-test", obj, "f", () => {
	console.log("After patch!");
});

/*
 * x
 * After patch!
 */
obj.f();

// Unpatch the function.
afterPatch.unpatch();

/*
 * x
 */
obj.f();
```
