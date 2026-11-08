# MuseFrame Studio 项目指南

本项目是人物与场景提示词工作台，使用 HTML、CSS 和原生 JavaScript。直接用浏览器打开根目录的 `index.html` 即可运行，无需安装依赖或构建。

## 常用入口

| 要查找或修改的内容 | 文件或代码入口 |
| --- | --- |
| 页面结构、按钮、面板、脚本加载顺序 | `index.html` |
| 页面布局、卡片、响应式样式 | `styles/studio.css` |
| 人物字段、默认值、可选词条 | `scripts/character-schema.js` 中的 `schema` |
| 内置人物参数、应用人物方案 | `scripts/character-editor.js` 中的 `builtInPlans`、`snapshotForPlan`、`applyPreset` |
| 人物预设卡片、排序、简介、配色、预览图 | `scripts/plan-preview.js` 中的 `renderPlanList`、`order`、`descriptions`、`palettes`、`imageFiles` |
| 出图模式、画幅、分辨率和画质 | `scripts/output-settings.js` |
| 场景地点、分类、环境参数 | `scripts/scene-settings.js` |
| 内置场景模板、自定义场景库 | `scripts/scene-library.js` |
| 场景融合控件与提示 | `scripts/scene-application.js` |
| 生成提示词 | `scripts/character-editor.js` 中的 `generate` |
| 方案保存、草稿、JSON 导入导出与备份 | `scripts/plan-storage.js`；启动时恢复草稿见 `scripts/startup.js` |
| 五步流程切换、场景卡片和场景预览 | `scripts/workflow-navigation.js` |

## 新增内置人物预设

1. 在 `character-editor.js` 的 `builtInPlans` 中添加唯一键、`label` 和人物字段。字段键查 `character-schema.js`，中文录入模板见 `人物设定.txt`。
2. 把同一个键加入 `plan-preview.js` 的 `order`，再填简介和配色。下拉菜单读取 `builtInPlans`，左侧卡片按 `order` 渲染，两处都需要登记。可参考 `morningDew`（晨露花语）。
3. 有预览图时，将图片放到 `images/characters/`，并在 `imageFiles` 的生成逻辑中注册该键。当前文件名按方案名称生成；没有配置图片时，卡片会显示占位图标。
4. 重新打开或刷新本地 `index.html`，确认左侧卡片和下拉菜单均可找到该方案。点击卡片，检查人物名称、参数和预览，再生成一次提示词确认设定已生效。

## 修改与验证

- 页面按 `index.html` 中的顺序加载普通脚本，部分脚本共用全局变量和函数。新增或调整脚本时检查它依赖哪些前置定义。
- 草稿、个人方案及自定义词库存于浏览器。涉及存储格式时，确认已有草稿和导出的 JSON 仍可恢复。
- 修改 JavaScript 后可用 `node --check <脚本路径>` 检查语法，并在浏览器中走一遍受影响的流程。
