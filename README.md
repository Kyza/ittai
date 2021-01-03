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
  <img src="https://github.com/Kyza/ittai/blob/master/media/3c9fa5fed87bcdd0.png">
</p>

<p align="center">
  <i>Ittai is a plugin builder for Discord client mods. Which ones? Yes.</i>
</p>

<hr>

## Features

 - Build even single-file BD plugins from multi-file projects.
 - Write one codebase, distribute one product.
 - Use various flavors of JS to create your plugins.
   - [JSX](https://reactjs.org/docs/introducing-jsx.html)
   - [TypeScript](https://www.typescriptlang.org/) (and TSX!)
   - [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (both `require("module");` and `import module from "module";`)
   - [CoffeeScript](https://coffeescript.org/)
 - I didn't forget about CSS!
   - Load your stylesheets easily.
     - `import style from "./style.css";`
     - `start() {style.use();}`
     - `stop() {style.unuse();}`
   - [SASS (SCSS)](https://sass-lang.com/)
   - [Stylus](https://stylus-lang.com/)
   - [LESS](http://lesscss.org/)
 - Build to almost any client mod.
   - [x] BetterDiscord
   - [ ] EnhancedDiscord
   - [x] Powercord **v2**
   - [x] Vizality

## Installation

### Requirements

 - [Git](https://git-scm.com/)
 - [NodeJS](https://nodejs.org/)
 - [Yarn](https://yarnpkg.com/) (optional)

### Installation Steps

```bash
git clone https://github.com/Kyza/ittai/
yarn
```

## How to Build

### Command Options

 - `--build="path/to/your/plugin"`
 - `--to="path/to/build/to"`
 - `--core="path/to/git/cloned/ittai/core"`
 - `--powercordv2` (optional)
   - Builds for Powercord v2.
 - `--betterdiscord` (optional)
   - Builds for BetterDiscord.
 - `--vizality` (optional)
   - Builds for Vizality.

### Build Command

```bash
yarn start --build="./test/plugin" --to="./test/build" --core="./core" --powercordv2 --betterdiscord --vizality
```
