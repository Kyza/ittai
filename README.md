<hr>

<h1 align="center">Ittai</h1>
  
<p align="center">
  <a href="#features">Features</a> |
  <a href="#installation">Installation</a> |
  <a href="#how-to-build">How to Build</a>
</p>

<p align="center">
  <i>
    <strong>What the heck</strong>?! I only need to use <strong>one style</strong> for my plugin?
  </i>
</p>
  
<p align="center">
  <i>
    <strong>Ittai</strong>?! I only need to use <strong>Ittai</strong> for my plugin?
  </i>
</p>
  
<p align="center">
  <img src="https://kyza.github.io/ittai/media/8deCFE7322dabFC9.png">
</p>

<p align="center">
  <i>Ittai is a plugin builder for Discord client mods. Which ones? Yes.</i>
</p>

<hr>

## Features

- Build even single-file BD plugins from multi-file projects.
- Write one codebase, distribute one product.
- Hot rebuild your plugins.
- Use various flavors of JS to create your plugins.
  - [x] [JSX](https://reactjs.org/docs/introducing-jsx.html)
  - [ ] [TypeScript](https://www.typescriptlang.org/) (and TSX!)
  - [x] [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (both `require("module");` and `import module from "module";`)
  - [ ] [CoffeeScript](https://coffeescript.org/)
- I didn't forget about CSS!
  - [x] Load your stylesheets easily.
    - `import style from "./style.css";`
    - `start() {style.add();}`
    - `stop() {style.remove();}`
  - [x] [SASS (SCSS)](https://sass-lang.com/)
  - [x] [Stylus](https://stylus-lang.com/)
  - [x] [LESS](http://lesscss.org/)
- Build to almost any client mod.
  - [x] BetterDiscord
  - [x] Powercord **v2**
  - [x] Vizality

## Installation

### Requirements

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
- [pnpm](https://pnpm.js.org/) (optional)

### Installation Steps

```bash
git clone https://github.com/Kyza/ittai/
pnpm i
```

## How to Build

### Command Options

- `--plugin="path/to/your/plugin"`
- `--betterdiscord` (optional)
  - Specify `="path/to/plugin/folder"` to copy the built file to the folder.
  - Builds for BetterDiscord.
- `--powercordv2` (optional)
  - Specify `="path/to/plugin/folder"` to copy the built files to the folder.
  - Builds for Powercord v2.
- `--vizality` (optional)
  - Specify `="path/to/plugin/folder"` to copy the built files to the folder.
  - Builds for Vizality.
- `--watch` (optional)
  - Will watch for changes in your plugin's unbuilt files and automatically run the command again for you.

### Build Command

This command will build your plugin for BetterDiscord, Powercord v2, and Vizality, but will only copy it to the Vizality plugin's folder. It will also hot rebuild your plugin for you.

```bash
pnpm start --plugin="./test/plugin" --betterdiscord --powercordv2 --vizality="C:/Users/Kyza/GitHub/vizality/addons/plugins/fgbd" --watch
```
