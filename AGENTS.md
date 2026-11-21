# NimeVista 项目指南

本项目是人物与场景提示词工作台，使用 HTML、CSS 和原生 JavaScript。直接用浏览器打开根目录的 `index.html` 即可运行，无需安装依赖或构建。

## 常用入口

| 要查找或修改的内容 | 文件或代码入口 |
| --- | --- |
| 页面结构、按钮、面板、脚本加载顺序 | `index.html` |
| 页面布局、卡片、响应式样式 | `styles/studio.css` |
| 人物字段、默认值、可选词条 | `scripts/character-schema.js` 中的 `schema` |
| 内置人物参数、简介、配色、预览图 | `data/characters/<ID>.json` |
| 人物预设顺序、卡片渲染、应用 | `data/characters/index.json`、`scripts/plan-preview.js` 的 `renderPlanList`、`scripts/character-editor.js` 的 `snapshotForPlan` 和 `applyPreset` |
| 出图模式、画幅、分辨率和画质 | `scripts/output-settings.js` |
| 场景地点、分类、环境参数 | `scripts/scene-settings.js` |
| 内置场景模板、自定义场景库 | `scripts/scene-library.js` |
| 场景融合控件与提示 | `scripts/scene-application.js` |
| 生成提示词 | `scripts/character-editor.js` 中的 `generate` |
| 方案保存、草稿、JSON 导入导出与备份 | `scripts/plan-storage.js`；启动时恢复草稿见 `scripts/startup.js` |
| 五步流程切换、场景卡片和场景预览 | `scripts/workflow-navigation.js` |

## 新增内置人物预设

1. 在 `data/characters/` 中新增以唯一 ID 命名的 JSON，参考 `morningDew.json`。将人物名称和参数填入 `plan`，简介和卡片配色分别填入 `description` 和 `palette`。字段键查 `character-schema.js`。
2. 有预览图时，将图片放到 `images/characters/`。多张图在人物 JSON 的 `images` 数组中按顺序填写文件名，第一张用于卡片和默认预览，打开大图后可用左右键浏览同一角色的图片。单张图也可继续使用 `image` 字段。新增人物默认追加到末尾。如需置于指定位置，可在 `index.json` 的 `cardOrder` 和 `presetOrder` 中分别调整卡片和下拉顺序。
3. 运行 `node scripts/build-character-library.mjs` 更新 `scripts/character-library.js`，提交时包含生成文件。可运行 `node scripts/build-character-library.mjs --check` 验证生成文件与人物 JSON 一致。
4. 刷新 `index.html`，检查人物卡片、下拉菜单、参数和预览，再生成一次提示词。

## 新增内置场景

1. 在 `scene-settings.js` 的 `sceneDefinitions` 地点列表和 `sceneLocationGroups` 对应分类中加入同一个地点名。`03 场景设计` 的地点下拉框和右侧场景卡片由这里生成。
2. 在 `scene-library.js` 的 `sceneLibraryBuilt` 中加入同名条目，填入场景核心提示词。切换地点时会按地点名自动匹配该模板。
3. 在 `scene-application.js` 的 `motifs` 中补一条简短环境特征。未编辑的内置模板会优先使用这条短语，避免整段模板重复进入提示词；夜景地点还需要在 `nightLighting` 中登记。
4. 将预览图放到 `images/scenes/`，文件名必须与地点名完全一致，例如 `冷银蓝珠宝棚.png`。卡片缩略图和 `03 场景设计` 的大图都会按地点名自动读取。
5. 刷新 `index.html`，进入 `03 场景设计`，确认地点下拉框、场景卡片、缩略图和大图预览正常；启用场景后生成一次提示词，确认场景模板和地点已进入结果。

## 修改与验证

- 页面按 `index.html` 中的顺序加载普通脚本，部分脚本共用全局变量和函数。新增或调整脚本时检查它依赖哪些前置定义。
- 草稿、个人方案及自定义词库存于浏览器。涉及存储格式时，确认已有草稿和导出的 JSON 仍可恢复。
- 修改 JavaScript 后可用 `node --check <脚本路径>` 检查语法，并在浏览器中走一遍受影响的流程。
