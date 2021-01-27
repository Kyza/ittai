{@link module:utils/patcher.patch|Patch}ing functions is a common way to inject code into Discord. Ittai provides three types of patches.

- {@link module:utils/patcher.before|Before} runs your code before the function is executed.
- {@link module:utils/patcher.instead|Instead} Runs your code instead of the function.
- {@link module:utils/patcher.after|After} runs your code after the function is executed.

{@link module:utils/patcher.before}, {@link module:utils/patcher.instead|utils/patcher.instead}, and {@link module:utils/patcher.after} are also shorthand functions available in the patcher.

Ittai will automatically unpatch all of your functions when the plugin stops, so no need to worry about forgetting and leaving a patch hanging in the void.

Here's a basic example of how to use Ittai's patcher.

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
const beforePatch = ittai.utils.patcher.patch(
	"patch-test",
	obj,
	"f",
	"before",
	() => {
		console.log("Before patch!");
	}
);

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

You can also add multiple patches and combine patches of different types together.
