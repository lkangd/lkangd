---
title: 我常用的 vscode 扩展
date: '2020-02-05'
spoiler: 编辑器 + 插件 = IDE ？
---

[[TOC]]

早些年初次接触编程的时候学习的是 C，用的当然只能是 visual studio 2007 之类的老古董，界面古老，操作也不友好。当时大家都是这么用的，也没在意。

后来不经意间接触到了 SublimeText，当时就被它的包管理系统和丰富的主题样式所吸引，立马爱上了这个「性感」的编辑器。但是无奈于国内的「复杂」的网络环境，每次下个插件总要耗费很长时间，并且存在下载失败的可能，且 SublimeText 是闭源的，需要很高的授权费（相对学生党来说），所以一直想找一款好用趁手的编辑器来作为替代品。

就这样时间走到了 2015 底，微软宣布开源 VSCode，其开箱即用、丝般顺滑的运行速度、强大的插件系统、丰富的主题和跨三大系统（支持 Windows，Mac 和 Linux）运行的能力迅速吸引了一大批用户，尤其是[Atom](https://atom.io/){target=_blank}的用户开始大量倒戈。我就是在那个时候开始接触和使用 VSCode 的。时至今天，VSCode 仍然保持每月一大更的速度，为用户提供了一个有保证和持续趋近完美的代码编辑器。

很多人会说 VSCode 只是个代码编辑器而已，用起来没有 Webstorm 这样的 IDE 顺手。从用户的角度来说，确实会有这样的感觉。但是，VSCode 具有强大的插件系统生态，并且在国内也布设了服务器，所以通过插件来增强 VScode 是一件很容易的事情。而且，当所有插件都不能满足你的时候，你甚至可以开发属于自己的插件，VSCode 提供了完备的插件开发示例和文档。

作为一个 js 开发者，下面介绍一下我开发时常用到的一些 VSCode 插件，可以给刚开始使用 VSCode 的朋友提供一个小小的参考。

---

## 辅助编码

#### [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag){target=\_blank}

提供像 Visual Studio 一样的 HTML/XML 标签重命名功能。

#### [AutoFileName](https://marketplace.visualstudio.com/items?itemName=JerryHong.autofilename){target=\_blank}

引入类库或本地文件时，时自动补全文件名。

#### [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker){target=\_blank}

错误拼写的变量名有时候会让你很尴尬，这个基本的拼写检查器，可以很好地使用 camelCase 代码。它的目标是帮助捕获常见的拼写错误，同时保持低误报率。

#### [CodeMetrics](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-codemetrics){target=\_blank}

分析定义的每个函数的逻辑复杂度，提醒你适度分离函数逻辑，编写和重构代码的利器。

#### [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint){target=\_blank}

提供 ESlint 错误提示和一键(可修复状态下)修复错误的功能。

#### [filesize](https://marketplace.visualstudio.com/items?itemName=mkxml.vscode-filesize){target=\_blank}

在编辑器的状态栏中显示当前编辑文件的大小。点击状态栏组件，它会显示更多关于文件的信息。

#### [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost){target=\_blank}

显示引入的每个类库的文件大小。

#### [JavaScript Booster](https://marketplace.visualstudio.com/items?itemName=sburg.vscode-javascript-booster){target=\_blank}

提供了类似传统 IDE 一键重构代码块的功能。

#### [JS Refactor](https://marketplace.visualstudio.com/items?itemName=cmstead.jsrefactor){target=\_blank}

同上类似。

#### [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion){target=\_blank}

它根据在工作区中找到的定义或通过 link 元素引用的外部文件为 HTML 类属性提供 CSS 类名自动补全的功能。

#### [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense){target=\_blank}

引入 npm 包依赖时，自动补全 npm 包名。

#### [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense){target=\_blank}

根据当前项目文件的上下文提供路径名自动补全的功能。

#### [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode){target=\_blank}

号称可以使用云 AI 的方式来帮助你提高编写代码的效率，目前支持 Python、Typescript/JavaScript 和 Java。

---

## 格式化

#### [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2){target=\_blank}

用颜色来匹配括号。你可以定义各种括号匹配使用的颜色，帮助你快速锁定当前关注的代码块。

#### [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv){target=\_blank}

提供项目中 .env 环境变量文件的高亮显示支持。

#### [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow){target=\_blank}

使文本前面的缩进着色，每步可交替使用四种不同的颜色。对 Python 语言尤其有用。

#### [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode){target=\_blank}

人人都在用的前端代码格式化工具，根据最先找到的自定义 prettier 格式化文件来格式化代码，支持 JavaScript、TypeScript、Flow、JSX、JSONCSS、SCSS、Less、HTML、Vue、Angular、GraphQL、Markdown、YAML 等等，前端「所有」的文件格式化需求，一个工具搞定。

#### [Trailing Spaces](https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces){target=\_blank}

运行 VSCode 格式化命令时，自动删除行后的多余空格。

---

## Git 相关

#### [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens){target=\_blank}

VSCode 最强大的 git 插件，没有之一。通过 Git 责备注释和代码镜头，它可以帮助你直观地看到代码的作者身份，无缝地导航和探索 Git 存储库，通过强大的比较命令获得有价值的见解，等等。

#### [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory){target=\_blank}

提供一个界面交互式的 git log 回溯界面，作为对 GitLens 的补充。

---

## 效率

#### [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks){target=\_blank}

它可以给代码行或块打上书签标记，并在书签之间快速跳转，可分组和自定义书签名。对于日志文件分析和代码库分析非常有用。

#### [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome){target=\_blank}

提供 VSCode 在 Chrome 打断点 debug 的模式，支持 Chrome DevTools 协议。

#### [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis){target=\_blank}

可以自动为 TypeScript 和 JavaScript 文件生成详细的 JSDoc 注释。

#### [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview){target=\_blank}

在边栏和你鼠标悬停在的图片路径上显示图片的预览图。

#### [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script){target=\_blank}

一键运行 package.json 中定义 npm 脚本和根据 package.json 中定义的依赖项验证模块是否安装和安装正确。

#### [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager){target=\_blank}

项目收藏管理，可快速切换和打开之前收藏过的项目。

#### [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=\_blank}

允许你直接在 VSCode 中发送 HTTP 请求并查看响应。

#### [SVG Viewer](https://marketplace.visualstudio.com/items?itemName=cssho.vscode-svgviewer){target=\_blank}

在 VSCode 中直接预览 SVG 图片文件。

#### [Translator Helper](https://marketplace.visualstudio.com/items?itemName=XiaodiYan.translator-helper){target=\_blank}

通过调用谷歌翻译的接口，直接在 VSCode 内将英文翻译成中文。

#### [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens){target=\_blank}

提供查看当前 package.json 的依赖的版本建议的功能。

#### [vscode-random](https://marketplace.visualstudio.com/items?itemName=jrebocho.vscode-random){target=\_blank}

快速生成一段可指定格式(电子邮件、城市、整数等等)的随机文本。

---

## Vue 相关

#### [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur){target=\_blank}

基于 vue-language-server 实现的 vue 工具，包含代码高亮、代码片段、Emmet 补全、错误提示、自动补全和 debug 的功能， vue 开发者必备。

#### [Vue Peek](https://marketplace.visualstudio.com/items?itemName=dariofuzinato.vue-peek){target=\_blank}

vue 组件定义快速跳转。

#### [Vue 2 Snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets){target=\_blank}

vue 代码片段。

#### [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets){target=\_blank}

vue 代码片段。

#### [VueHelper](https://marketplace.visualstudio.com/items?itemName=oysun.vuehelper){target=\_blank}

vue 代码片段。

---

## 界面美化

#### [Beautiful UI](https://marketplace.visualstudio.com/items?itemName=swashata.beautiful-ui){target=\_blank}

从 Sublime 主题「DA CS」移植过来的主题套件，包含 32 个不同的黑暗/白天主题。

#### [GitHub Theme](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme){target=\_blank}

Github 风格的 VSCode 主题。

#### [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme){target=\_blank}

一套 Material 风格的 icon。

#### [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css){target=\_blank}

千人千面，众口难调。当所有的主题都让你感觉差一点，但你又不想大费周章地自己开发一个主题的时候，那么你需要这个插件。它通过覆盖 VSCode 自带 CSS 样式的方式来让你自定义样式。我习惯通过这个插件来让所有字体都不超过 12px，这样感觉更美观，同时可以让我在 13 寸的屏幕同时里面看到更多的内容。

---

当我发现新的好玩、有用的 VSCode 扩展的时候，就会更新这个列表。

以上，当然你有好的 VSCode 扩展也可以跟我分享。😁 Happy Hacking.
