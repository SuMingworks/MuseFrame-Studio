      // V1.4 output-mode controls. Prompt-only specifications: actual resolution/format depend on the rendering service.
      const outputDefaults = { mode: 'four', ratio: '16:9', resolution: '2K', quality: '精细' };
      let outputSettings = { ...outputDefaults };
      const outputModeDescriptions = {
        four: [
          '四视图摄影与一致性',
          '左侧约40%正面头肩特写，右侧约60%依次排列正面、严格90度侧面、背面全身视图',
          '三个全身视图使用同一角色资产、同一中立站姿、同一身高和脚底基线，仅观察角度改变',
          '使用正交或低畸变镜头，脚部完整入镜',
          '各视图保持相同的五官、神态、人体比例与固有色，发束走向、服装剪裁、纹样与饰品固定点连续对应',
        ],
        five: [
          '五分区角色',
          '横向排列五个展示区域，从左到右依次为面部及上半身特写、正面全身、严格90度侧面全身、背面全身、原图姿势全身展示',
          '左侧特写占较大画面，清晰展示脸型、五官、妆容与发型；其余四个全身人物从头顶到脚底完整入镜',
          '正面、侧面、背面采用同一中立站姿、相同身高和脚底基线，分别展示正面服装与人体比例、侧面轮廓与服装结构、背面发型与服装',
          '最右侧参考原图动作姿势展示角色的标志性动作；若没有提供原图，则采用符合角色气质的自然展示姿势',
          '五个区域均为同一角色，保持面容、人体比例、发型、服装剪裁、纹样、颜色和配饰一致，背景简洁、区域清晰',
        ],
        full: [
          '单人全身立绘构图',
          '画面仅出现一位完整人物，从头顶到鞋底完整入镜，突出服装整体剪裁和人物气质',
          '正面或轻微三分之四视角，保持单人单画面',
        ],
        group: [
          '双人同框构图',
          '单幅连续画面中恰好有两位不同角色，按各自的左右站位全身入镜，轮廓清晰可辨',
          '每位角色保留自己对应的五官、发型和服装；两人共享一致的透视、空间尺度和主光方向',
        ],
        face: [
          '面部肖像特写构图',
          '画面仅出现一个人物头肩肖像，清晰展示脸型、眼部、妆容、发际线、头饰和耳饰',
          '近景镜头，面部无遮挡、双眼清晰对焦，构图止于肩部',
        ],
        poses: [
          '三姿态展示构图',
          '同一角色从左到右展示中立站姿、轻动态姿态、造型展示姿态，三个全身人物均完整入镜',
          '三个姿态保持同一面容、服装、发色、饰品、人体比例与材质，不出现角色身份漂移',
        ],
        poster: [
          '场景氛围海报构图',
          '单个角色作为画面主体，保留清晰的主体轮廓与空间层次',
          '采用单幅电影感构图，服装和面容清晰可辨',
        ],
        characterBoard: [
          '人物设定展示板',
          '专业角色设计设定板排版：人物主视觉占据主要区域，旁边整齐排列同一角色的正面、侧面和背面全身视图',
          '辅以面部表情参考、眼睛和发型特写、服装与饰品局部细节，区域层次清晰，背景简洁',
          '所有视图和细节保持同一角色的面容、发型、体型、服装、颜色和饰品一致；全身视图从头到脚完整入镜',
          '可用简洁标题和少量标签辅助展示，避免密集或无法辨认的文字',
        ],
        fashionBoard: [
          '服装设计展示板',
          '专业服装设计展板排版：以角色全身造型为主视觉，旁边排列同一套造型的正面、侧面和背面视图',
          '辅以服装结构示意、面料与材质、配色方案、饰品和工艺细节，以及与设计主题相符的灵感参考',
          '各视图和局部保持人物、服装剪裁、纹样、颜色与饰品一致，结构和细节对应主造型，不凭空增加配件',
          '展板分区清晰、视觉协调，可用简洁标题和少量标签辅助展示，避免密集或无法辨认的文字',
        ],
        details: [
          '服装细节展示构图',
          '以角色全身展示为主，辅以服装接缝、领口、袖口、鞋履、发饰和面料纹理的局部放大细节',
          '各局部细节必须对应同一套角色服装和同一组饰品，不凭空增加新的配件',
        ],
      };
      // Interface guidance is separate from the generated prompt.
      const outputModeGuides = {
        four: ['画面内容：左侧约占四成的是头肩特写，右侧依次为正面、90°侧面和背面全身；三个全身视图站姿、身高和脚底基线一致。', '能看清什么：特写展示五官、妆容和发型；正面查看服装与人体比例，侧面查看轮廓，背面查看发型、服装和配饰的位置。', '适用：角色设定、造型核对和建模参考。建议横向画幅。'],
        five: ['画面内容：从左到右依次为面部及上半身特写、正面全身、90°侧面全身、背面全身、动作姿势全身，共五个区域。', '能看清什么：特写展示脸型、五官、妆容和发型；三个标准视图展示服装的正侧背结构；最后一个视图展示角色姿态。', '适用：角色设定加动作展示。建议横向画幅；要还原原图姿势，需在出图工具中提供参考图，否则使用自然姿势。'],
        full: ['画面内容：一位角色从头顶到鞋底完整入镜，采用正面或轻微三分之四视角。', '能看清什么：整体身形、发型、服装层次与剪裁、配饰、鞋履和角色气质；以整套造型为主。', '适用：角色立绘、整体造型与服装搭配展示。竖向画幅通常更容易容纳全身。'],
        group: ['画面内容：两位不同角色位于同一连续画面，按左右站位全身入镜；可分别设置动作，并设置两人互动。', '能看清什么：两人的面容、发型、服装及彼此的站位和互动，同时保持空间尺度和光线一致。', '适用：双人搭档、人物关系与互动场景。请在下方为左右站位加入角色；建议横向画幅。'],
        face: ['画面内容：一位角色的头肩近景，画面止于肩部，面部无遮挡，双眼清晰对焦。', '能看清什么：脸型、眼睛、五官、妆容、发际线、头饰和耳饰；全身服装不在展示范围内。', '适用：头像、角色面部辨识和妆容细节。可选择方形或竖向画幅。'],
        poses: ['画面内容：同一角色从左到右展示中立站姿、轻动态姿态、造型展示姿态，三个全身人物均完整入镜。', '能看清什么：同一套造型在不同动作下的整体轮廓、服装和饰品，同时对照面容、发色与体型是否一致。', '适用：动作探索、角色表现和造型展示。建议横向画幅。'],
        poster: ['画面内容：单个角色作为主体，置于一幅具有空间层次和电影感的场景画面中。', '能看清什么：角色的面容、服装与主体轮廓，以及人物和环境共同形成的氛围；不拆分为多个设定视图。', '适用：宣传海报、故事场景和情绪表达。可启用场景并设置地点、天气和光照，再按用途选择画幅。'],
        characterBoard: ['画面内容：人物主视觉搭配正侧背全身视图、表情参考和外观细节，组成一张角色设定板。', '适用：人物形象展示、角色设定与后续创作参考。建议横向画幅；文字和细节的准确度取决于出图工具。'],
        fashionBoard: ['画面内容：全身造型搭配正侧背视图、服装结构、材质、配色和灵感参考，组成一张服装设计展板。', '适用：服装概念展示和造型设计参考。建议横向画幅；文字和结构图的准确度取决于出图工具。'],
        details: ['画面内容：一张角色全身图作为主体，旁边辅以同一套服装和饰品的局部放大图。', '具体展示：领口和袖口的形状、服装接缝与剪裁、鞋履和发饰的造型，以及面料表面纹理；局部必须对应全身造型，不额外添加配件。', '适用：服装结构、材质与饰品设计参考。建议横向画幅，为全身和局部放大留出空间。'],
      };
      const outputDims = {
        '16:9': { '1K': [1280, 720], '2K': [2560, 1440], '4K': [3840, 2160] },
        '3:2': { '1K': [1200, 800], '2K': [2400, 1600], '4K': [3600, 2400] },
        '4:3': { '1K': [1024, 768], '2K': [2048, 1536], '4K': [4096, 3072] },
        '1:1': { '1K': [1024, 1024], '2K': [2048, 2048], '4K': [4096, 4096] },
        '3:4': { '1K': [768, 1024], '2K': [1536, 2048], '4K': [3072, 4096] },
        '9:16': { '1K': [720, 1280], '2K': [1440, 2560], '4K': [2160, 3840] },
      };
      const qualityDescriptions = {
        标准: '清楚的角色轮廓和基础材质，适合快速构图与造型测试',
        精细: '高质量PBR材质、适度皮肤SSS、清晰发束、可信织物纹理和精确接缝',
        极致: '高精度PBR和皮肤次表面散射，微观纤维、细腻发丝、精确金属反射、复杂配饰和一致的材质细节',
      };
      function groupRoleSnapshot(record, action = '') {
        if (!record?.values || typeof record.values !== 'object') return null;
        return {
          name: typeof record.name === 'string' && record.name.trim() || '未命名角色',
          values: Object.fromEntries(fields.map(([key, , choices]) => [
            key,
            typeof record.values[key] === 'string' ? record.values[key] : choices[0],
          ])),
          customFields: [...readCustomFields(record)],
          action,
        };
      }
      function normalizeGroup(group) {
        return {
          roles: [0, 1].map((index) => {
            const role = Array.isArray(group?.roles) ? group.roles[index] : null;
            return groupRoleSnapshot(role, typeof role?.action === 'string' ? role.action : '');
          }),
          interaction: typeof group?.interaction === 'string' ? group.interaction : '',
        };
      }
      function normalizeOutputSettings(o) {
        const n = { ...outputDefaults };
        if (o && typeof o === 'object') {
          for (const k of Object.keys(n)) {
            const choices =
              k === 'mode'
                ? Object.keys(outputModeDescriptions)
                : k === 'ratio'
                  ? Object.keys(outputDims)
                  : k === 'resolution'
                    ? ['1K', '2K', '4K']
                    : Object.keys(qualityDescriptions);
            if (choices.includes(o[k])) n[k] = o[k];
          }
        }
        if (o?.group || n.mode === 'group') n.group = normalizeGroup(o?.group);
        return n;
      }
      const groupOutput = document.getElementById('groupOutput');
      const groupInteraction = document.getElementById('groupInteraction');
      function setupGroupChoice(select, custom, optionsId, onChange) {
        select.append(new Option('请选择', ''));
        document.querySelectorAll('#' + optionsId + ' option').forEach((option) =>
          select.append(new Option(option.value, option.value)));
        select.append(new Option('自定义…', '__custom__'));
        select.addEventListener('change', () => {
          custom.hidden = select.value !== '__custom__';
          if (!custom.hidden) custom.focus();
          onChange(custom.hidden ? select.value : custom.value);
        });
        custom.addEventListener('input', () => onChange(custom.value));
        return (value) => {
          const preset = [...select.options].some((option) => option.value === value && value !== '__custom__');
          select.value = preset ? value : '__custom__';
          custom.hidden = preset;
          custom.value = preset ? '' : value;
        };
      }
      const refreshInteraction = setupGroupChoice(
        groupInteraction, document.getElementById('groupInteractionCustom'), 'groupInteractionOptions',
        (value) => {
          outputSettings.group = { ...outputSettings.group, interaction: value };
          generate();
          storeDraft();
        },
      );
      function updateGroup(group, index, role) {
        const roles = [...group.roles];
        roles[index] = role;
        outputSettings.group = { ...group, roles };
        generate();
        storeDraft();
      }
      const groupControls = ['左侧', '右侧'].map((position, index) => {
        const slot = document.createElement('div');
        slot.innerHTML = `
          <label>${position}角色<select aria-label="${position}角色预设"></select></label>
          <div class="small" aria-live="polite"></div>
          <button type="button">用当前编辑人物</button>
          <button type="button">移除</button>
          <label>${position}动作<select class="group-action"></select><input class="group-action-custom" placeholder="输入自定义动作" hidden /></label>`;
        document.getElementById('groupRoles').append(slot);
        const select = slot.querySelector('select');
        const status = slot.querySelector('.small');
        const [useCurrent, remove] = slot.querySelectorAll('button');
        const action = slot.querySelector('.group-action');
        const refreshAction = setupGroupChoice(action, slot.querySelector('.group-action-custom'), 'groupActionOptions', (value) => {
          const group = outputSettings.group;
          updateGroup(group, index, { ...group.roles[index], action: value });
        });
        const refresh = () => {
          const role = outputSettings.group?.roles[index];
          select.replaceChildren(new Option('选择人物预设…', ''));
          for (const item of document.getElementById('preset').children)
            select.append(item.cloneNode(true));
          select.value = '';
          status.textContent = role ? '已加入：' + role.name : '尚未加入角色';
          refreshAction(role?.action || '');
          action.disabled = remove.disabled = !role;
        };
        const replace = (record) => {
          updateGroup(outputSettings.group, index, groupRoleSnapshot(record));
          refresh();
        };
        select.addEventListener('focus', refresh);
        select.addEventListener('change', () => {
          const key = select.value;
          if (!key) return;
          replace(key.startsWith('custom:')
            ? customPresets[key.slice(7)]
            : { name: builtInPlans[key].label, values: snapshotForPlan(key) });
        });
        useCurrent.onclick = () => replace({ name: currentName(), values, customFields: [...customFields] });
        remove.onclick = () => replace(null);
        return refresh;
      });
      function refreshOutputControls() {
        for (const [id, key] of [
          ['outputMode', 'mode'],
          ['outputRatio', 'ratio'],
          ['outputResolution', 'resolution'],
          ['outputQuality', 'quality'],
        ])
          document.getElementById(id).value = outputSettings[key];
        groupOutput.hidden = outputSettings.mode !== 'group';
        if (!groupOutput.hidden) {
          outputSettings.group ??= normalizeGroup();
          groupControls.forEach((refresh) => refresh());
          refreshInteraction(outputSettings.group.interaction);
        }
        const guide = document.getElementById('outputModeGuide');
        guide.replaceChildren(...outputModeGuides[outputSettings.mode].map((text) => {
          const paragraph = document.createElement('p');
          paragraph.textContent = text;
          return paragraph;
        }));
        const [w, h] = outputDims[outputSettings.ratio][outputSettings.resolution];
        document.getElementById('outputSummary').textContent =
          `当前：${document.getElementById('outputMode').selectedOptions[0].textContent} · ${outputSettings.ratio} · ${outputSettings.resolution}（目标 ${w} × ${h} 像素）· ${outputSettings.quality}画质。实际像素由外部图像生成工具决定。` +
          (outputSettings.mode === 'five' ? ' 建议使用横向画幅；要还原原图姿势，请在出图工具中同时提供参考图。' : '');
      }
      function setOutputSettings(o) {
        outputSettings = normalizeOutputSettings(o);
        refreshOutputControls();
        generate();
      }
      for (const [id, key] of [
        ['outputMode', 'mode'],
        ['outputRatio', 'ratio'],
        ['outputResolution', 'resolution'],
        ['outputQuality', 'quality'],
      ])
        document.getElementById(id).addEventListener('change', (e) => {
          outputSettings[key] = e.target.value;
          refreshOutputControls();
          generate();
          storeDraft();
        });
      promptOutput = () => {
        const { mode, ratio, quality } = outputSettings;
        const [title, ...framing] = outputModeDescriptions[mode];
        const group = mode === 'group' ? outputSettings.group : undefined;
        return { mode, title, framing, ratio, quality: qualityDescriptions[quality], group };
      };
      const applyBeforeOutput = applyPreset;
      applyPreset = function (k) {
        const keepGroup = outputSettings.mode === 'group';
        if (!applyBeforeOutput(k) || activePlan !== k) return false;
        const saved = k.startsWith('custom:') ? customPresets[k.slice(7)] : null;
        if (keepGroup && saved?.outputSettings?.mode !== 'group') {
          storeDraft();
          return true;
        }
        setOutputSettings(saved?.outputSettings || outputDefaults);
        setSceneSettings(saved?.sceneSettings || sceneDefaults, false);
        return true;
      };
      const saveAsBeforeOutput = document.getElementById('savePreset').onclick;
      // The existing save handlers already persist outputSettings, including subsequent updates.
      const importConfigBeforeOutput = document.getElementById('fileJson').onchange;
      document.getElementById('fileJson').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const c = JSON.parse(await file.text());
          if (!c.values || typeof c.values !== 'object') throw Error('缺少角色参数');
          for (const f of fields)
            if (typeof c.values[f[0]] === 'string') values[f[0]] = c.values[f[0]];
          customFields = readCustomFields(c);
          activePlan = '';
          baseline = { ...values };
          setName(c.name || '导入角色');
          render();
          setOutputSettings(c.outputSettings || outputDefaults);
          setSceneSettings(c.sceneSettings || sceneDefaults, false);
          storeDraft();
          document.getElementById('presetInfo').textContent =
            '已导入角色及画面输出配置，可另存为个人方案。';
        } catch (err) {
          alert('配置文件格式不正确：' + err.message);
        } finally {
          e.target.value = '';
        }
      };
      refreshOutputControls();
      generate();

