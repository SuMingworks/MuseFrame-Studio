      const key = 'character_prompt_v31_options';
      let extras = {};
      try {
        extras = JSON.parse(localStorage.getItem(key) || '{}');
      } catch {}
      const fields = schema.flatMap((g) => g.fields);
      let values = Object.fromEntries(fields.map((f) => [f[0], f[2][0]]));
      let customFields = new Set();
      function readCustomFields(record) {
        return new Set(Array.isArray(record?.customFields) ? record.customFields : []);
      }
      const legacyPresets = {};

      const customPresetKey = 'character_prompt_v33_presets';
      let customPresets = {};
      try {
        customPresets = JSON.parse(localStorage.getItem(customPresetKey) || '{}') || {};
      } catch {
        customPresets = {};
      }
      const styleField = fields.find((f) => f[0] === 'style');
      const builtInPlans = Object.fromEntries(
        Object.entries(characterLibrary).map(([id, record]) => [id, record.plan]),
      );
      const planKeys = fields.map((f) => f[0]);
      let activePlan = 'mist';
      let baseline = null;
      function snapshotForPlan(k) {
        const p = builtInPlans[k];
        if (!p) return null;
        const result = Object.fromEntries(fields.map((f) => [f[0], f[2][0]]));
        if (k === 'mist') return result;
        for (const f of fields) {
          const choice = p[f[0]];
          if (Number.isInteger(choice) && f[2][choice]) result[f[0]] = f[2][choice];
          else if (typeof choice === 'string') result[f[0]] = choice;
        }
        return result;
      }
      function renderPresetSelect(selected) {
        const el = document.getElementById('preset');
        el.innerHTML = '';
        const built = document.createElement('optgroup');
        built.label = '内置造型方案';
        Object.entries(builtInPlans).forEach(([k, p]) => {
          const o = document.createElement('option');
          o.value = k;
          o.textContent = p.label;
          built.append(o);
        });
        el.append(built);
        if (Object.keys(customPresets).length) {
          const own = document.createElement('optgroup');
          own.label = '我的保存方案';
          Object.entries(customPresets).forEach(([k, p]) => {
            const o = document.createElement('option');
            o.value = 'custom:' + k;
            o.textContent = p.name || k;
            own.append(o);
          });
          el.append(own);
        }
        if (selected && [...el.options].some((o) => o.value === selected)) el.value = selected;
      }
      function applyPreset(k) {
        let next = null,
          name = '';
        if (k.startsWith('custom:')) {
          const saved = customPresets[k.slice(7)];
          if (!saved) return;
          next = Object.fromEntries(
            fields.map((f) => [
              f[0],
              typeof saved.values?.[f[0]] === 'string' ? saved.values[f[0]] : f[2][0],
            ]),
          );
          name = saved.name || '我的造型';
        } else {
          next = snapshotForPlan(k);
          if (!next) return;
          name = k === 'mist' ? '雾蓝星屿' : builtInPlans[k].label;
        }
        customFields = readCustomFields(k.startsWith('custom:') ? customPresets[k.slice(7)] : null);
        values = next;
        activePlan = k;
        baseline = { ...next };
        document.getElementById('characterName').value = name;
        document.getElementById('presetInfo').textContent =
          '已完整载入「' +
          name +
          '」：' +
          planKeys.length +
          '项参数同步更新；手动修改后会显示差异。';
        render();
      }
      function markModified() {
        updateIntegrity();
      }
      function updateIntegrity() {
        const el = document.getElementById('integrityReport');
        if (!el) return;
        const changed = baseline ? fields.filter((f) => values[f[0]] !== baseline[f[0]]) : [];
        const conflicts = detectConflicts();
        const groupText = changed.map((f) => f[1]).join('、');
        const status = changed.length
          ? '当前方案已手动调整 ' + changed.length + ' 项：' + groupText
          : '当前30项参数与已加载方案完全一致';
        el.textContent =
          status +
          (conflicts.length ? '。结构提醒：' + conflicts.join('；') : '。未检测到已知的结构冲突');
        el.className = 'notice ' + (conflicts.length ? 'integrity-warn' : '');
      }
      function allOptions(f) {
        return [...f[2], ...(extras[f[0]] || [])];
      }
      const characterFieldOptions = (() => {
        const options = Object.fromEntries(fields.map(([id]) => [id, new Map()]));
        for (const [key, plan] of Object.entries(builtInPlans)) {
          const snapshot = snapshotForPlan(key);
          const name = plan.label.replace('｜原创示范', '');
          for (const [id, , defaults] of fields) {
            const value = snapshot[id];
            if (value.trim() && !defaults.includes(value) && !options[id].has(value)) {
              options[id].set(value, name);
            }
          }
        }
        return options;
      })();
      function fieldOption(value, name = '') {
        const option = document.createElement('option');
        option.value = value;
        const preview = value.length > 38 ? value.slice(0, 38) + '…' : value;
        option.textContent = name ? name + ' · ' + preview : preview || '未设置';
        return option;
      }
      function updateFaceCheck() {
        const host = document.getElementById('faceCheckList');
        if (!host) return;
        const checks = [
          ['face', '脸型', '脸部长度、颧骨、下颌与下巴'],
          ['brow', '眉毛', '眉形、眉峰、眉眼间距'],
          ['eyes', '眼型', '眼裂比例、眼距、眼尾方向'],
          ['iris', '虹膜', '颜色、相对大小与边缘'],
          ['nose', '鼻子', '鼻根、鼻梁、鼻尖、鼻翼'],
          ['lips', '嘴唇', '嘴宽、唇厚、唇峰、嘴角'],
        ];
        let filled = 0;
        host.replaceChildren();
        checks.forEach(([id, label, hint]) => {
          const value = typeof values[id] === 'string' ? values[id].trim() : '';
          const present = /[\p{L}\p{N}]/u.test(value) && !/^(无|暂无|未知|待填写|待补充|未填写|不详|无描述|none|n\/a)$/i.test(value);
          if (present) filled++;
          const item = document.createElement('div');
          item.className = 'face-check-item';
          const text = document.createElement('div');
          const title = document.createElement('strong');
          title.textContent = label;
          const detail = document.createElement('div');
          detail.className = 'small';
          detail.textContent = '可参考：' + hint;
          const status = document.createElement('span');
          status.className = present ? 'face-check-filled' : 'face-check-missing';
          status.textContent = present ? '已填写' : '待补充';
          text.append(title, detail);
          item.append(text, status);
          host.append(item);
        });
        document.getElementById('faceCheckCount').textContent = '已填写 ' + filled + ' / ' + checks.length;
      }
      function render() {
        const host = document.getElementById('groups');
        const nameNode = document.getElementById('nameEditor');
        if (nameNode) document.getElementById('nameEditorStaging').append(nameNode);
        host.innerHTML = '';
        const groups = [
          ['人物基础', ['mood', 'face', 'skin', 'body', 'style']],
          ['五官细节', ['brow', 'eyes', 'iris', 'nose', 'lips', 'makeup']],
          ['发型与配饰', ['hair', 'bangs', 'accessory', 'neckjewelry']],
          [
            '服装与造型',
            [
              'top',
              'bottom',
              'neckline',
              'sleeve',
              'socks',
              'shoes',
              'palette',
              'fabric',
              'pattern',
              'outfitDetail',
            ],
          ],
          ['姿势与动作', ['pose', 'poseTorso', 'poseArms', 'poseLegs', 'poseContact']],
        ];
        for (const [title, ids] of groups) {
          const panel = document.createElement('section');
          panel.className = 'param-group';
          const h = document.createElement('h3');
          h.textContent = title;
          panel.append(h);
          if (title === '人物基础') {
            const nameEditor = document.getElementById('nameEditor');
            if (nameEditor) {
              nameEditor.classList.add('basic-name-editor');
              panel.append(nameEditor);
            }
          }
          for (const id of ids) {
            const f = fields.find((x) => x[0] === id);
            if (!f) continue;
            const wrap = document.createElement('div');
            wrap.className = 'field';
            const label = document.createElement('label');
            label.textContent = f[1];
            const sel = document.createElement('select');
            sel.id = 'sel_' + id;
            label.htmlFor = sel.id;
            const regularOptions = new Set(allOptions(f).filter((value) => !value || !f[2].includes(value)));
            for (const value of regularOptions) sel.append(fieldOption(value));
            const characterOptions = characterFieldOptions[id];
            const fromCharacters = document.createElement('optgroup');
            fromCharacters.label = '人物预设词条';
            for (const [value, name] of characterOptions) {
              if (!regularOptions.has(value)) fromCharacters.append(fieldOption(value, name));
            }
            if (fromCharacters.children.length) sel.append(fromCharacters);
            if (!regularOptions.has(values[id]) && !characterOptions.has(values[id])) {
              const option = fieldOption(values[id]);
              option.dataset.currentDescription = 'true';
              sel.append(option);
            }
            sel.value = values[id];
            const edit = document.createElement('textarea');
            edit.id = 'edit_' + id;
            edit.value = values[id];
            edit.rows = 3;
            edit.className = 'field-edit';
            sel.onchange = () => {
              const value = sel.value;
              if (f[2].includes(value) || (!regularOptions.has(value) && characterOptions.has(value))) customFields.delete(id);
              else customFields.add(id);
              const currentOption = sel.querySelector('[data-current-description]');
              if (currentOption && currentOption.value !== value && f[2].includes(currentOption.value)) {
                currentOption.remove();
              }
              values[id] = value;
              edit.value = value;
              generate();
              updateVisual();
            };
            edit.oninput = () => {
              customFields.add(id);
              values[id] = edit.value;
              sel.querySelector('[data-current-description]')?.remove();
              let option = [...sel.options].find((item) => item.value === edit.value);
              if (!option) {
                option = fieldOption(edit.value);
                option.dataset.currentDescription = 'true';
                sel.append(option);
              }
              sel.value = edit.value;
              generate();
              updateVisual();
            };
            wrap.append(label, sel, edit);
            panel.append(wrap);
          }
          host.append(panel);
        }
        const add = document.getElementById('addField');
        add.innerHTML = '';
        fields.forEach((f) => {
          const o = document.createElement('option');
          o.value = f[0];
          o.textContent = f[1];
          add.append(o);
        });
        generate();
        updateVisual();
      }
      function uniqueParts(parts) {
        const seen = new Set();
        const out = [];
        for (let item of parts) {
          if (!item || !String(item).trim()) continue;
          item = String(item)
            .trim()
            .replace(/[。；]+$/, '');
          const key = item.replace(/[\s，。；：、]/g, '');
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(item);
        }
        return out;
      }
      function section(label, parts) {
        return '【' + label + '】\n' + uniqueParts(parts).join('；') + '。';
      }
      function detectConflicts() {
        const v = values,
          issues = [];
        if (/无袖|吊带/.test(v.top || '') && /长袖|灯笼|泡泡/.test(v.sleeve || ''))
          issues.push('上装与袖型不一致');
        if (/露肩|一字领/.test(v.top || '') && /立领|海军翻领/.test(v.neckline || ''))
          issues.push('露肩上衣与领型不一致');
        if (
          /短裤|牛仔裤|阔腿裤/.test(v.bottom || '') &&
          /裙撑|裙摆|蓬蓬裙/.test(v.outfitDetail || '')
        )
          issues.push('裤装与裙装补充结构不一致');
        if (/海军领/.test(v.top || '') && !/海军/.test(v.neckline || ''))
          issues.push('上装海军领与领型参数不一致');
        if (
          /皮革|革面/.test(v.top || '') &&
          /欧根纱|雪纺/.test(v.fabric || '') &&
          !/内搭/.test(v.fabric || '')
        )
          issues.push('皮革外套与面料参数可能不一致');
        return issues;
      }
      // The original built-in strings are also stored in existing plans and backups.
      // Resolve appearance by exact field value so edited and custom text stays intact.
      const builtInAppearance = (() => {
        const changes = [
          ['；正侧面体积关系保持一致', ''],
          ['关注正面颧颊体积与侧面下颌转折', '颧颊饱满度与下颌转折自然'],
          ['；正视与侧视保持同一眼睑开合关系', ''],
          ['；侧影和正面鼻翼宽度彼此吻合', ''],
          ['与后视轮廓', ''],
          ['，背面位置可追溯', ''],
          ['，后视褶距统一', '，褶距均匀'],
          ['，背面延续相同褶片与缝线', ''],
          ['，背面同样完整', ''],
          ['与后视裙层相互对应', '固定于裙腰'],
          ['，不同视角色彩一致', ''],
          ['；四视图保持一致神态', ''],
          ['，四个视角身形一致', ''],
          ['，背面延续规则明确', ''],
          ['；前侧背三面结构连贯，避免配件无故消失', ''],
        ];
        // Only remove sentences that repeat nearly all of an earlier sentence in
        // the same built-in field; distinct details and authored text stay intact.
        function compactBuiltInText(text) {
          const sentences = text.split(/(?<=[。！？])\s*/).filter(Boolean);
          const kept = [];
          for (const sentence of sentences) {
            const clean = sentence.replace(/[\s，。；：、！？]/g, '');
            if (clean.length >= 12 && kept.some((prior) => {
              const previous = prior.replace(/[\s，。；：、！？]/g, '');
              return previous.includes(clean);
            })) continue;
            kept.push(sentence);
          }
          return kept.length === sentences.length ? text : kept.join(' ');
        }
        const snapshots = Object.keys(builtInPlans).map(snapshotForPlan);
        return Object.fromEntries(fields.map(([key, , options]) => {
          const builtInValues = new Set([...options, ...snapshots.map((plan) => plan[key])]);
          const appearance = new Map();
          for (const original of builtInValues) {
            let description = original;
            for (const [viewConstraint, replacement] of changes)
              description = description.replace(viewConstraint, replacement);
            if (description !== original) appearance.set(original, description);
          }
          for (const original of builtInValues) {
            const existing = appearance.get(original) ?? original;
            const result = compactBuiltInText(existing);
            if (result !== original) appearance.set(original, result);
          }
          return [key, appearance];
        }));
      })();
      // Later scripts supply settings after their controls and state are initialized.
      let promptOutput = () => ({ mode: 'four', title: '四视图摄影与一致性', framing: [] });
      let promptScene = () => ({ enabled: false, blocks: [] });
      function characterPromptBlocks(characterValues, authoredFields, portrait) {
        const v = Object.fromEntries(fields.map(([key]) => {
          const value = characterValues[key];
          return [key, authoredFields.has(key) ? value : (builtInAppearance[key].get(value) ?? value)];
        }));
        const labeled = (label, value) => value && value.trim() ? label + '：' + value : '';
        return [
          section('01 · 美术定位', [
            '原创成年女性角色',
            v.style,
            v.mood,
            '统一服装轮廓、色彩节奏与人物气质，避免直接复制现有角色',
          ]),
          '',
          section('02 · 人物识别', [
            labeled('面型', v.face),
            labeled('眉形', v.brow),
            labeled('眼睑与眼型', v.eyes),
            labeled('虹膜', v.iris),
            labeled('鼻部', v.nose),
            labeled('唇部', v.lips),
            labeled('皮肤', v.skin),
            labeled('妆容', v.makeup),
          ]),
          '',
          section('03 · 发型与服装', [
            labeled('发型', v.hair),
            labeled('刘海', v.bangs),
            labeled('发饰与耳饰', v.accessory),
            labeled('上衣', v.top),
            labeled('领部', v.neckline),
            ...(!portrait ? [
              labeled('袖部', v.sleeve),
              labeled('下装', v.bottom),
              labeled('袜类', v.socks),
              labeled('鞋履', v.shoes),
            ] : []),
            labeled('配色', v.palette),
            labeled('材料', v.fabric),
            labeled('图案', v.pattern),
            labeled('颈部饰件', v.neckjewelry),
            ...(!portrait ? [labeled('剪裁与层级', v.outfitDetail)] : []),
          ]),
          '',
          ...(portrait ? [] : [
            section('04 · 人体比例', [
              v.body,
              '保持可信的人体比例与关节结构',
            ]),
            '',
          ]),
        ];
      }
      function generate() {
        const name = document.getElementById('characterName').value.trim() || '未命名角色';
        const { mode, title, framing, ratio, quality, group } = promptOutput();
        const scene = promptScene(mode);
        const incomplete = group && group.roles.some((role) => !role);
        const poseFields = ['pose', 'poseTorso', 'poseArms', 'poseLegs', 'poseContact'];
        const poseLines = poseFields.flatMap((key) => {
          const field = fields.find((item) => item[0] === key);
          const value = (values[key] || '').trim();
          return value ? [field[1] + '：' + value] : [];
        });
        const composition = section(group ? title : '05 · ' + title, [
          ...framing.map((line) => mode === 'five' && poseLines.length && line.startsWith('第五分区优先参考原图')
            ? '第五分区优先参考原图中的动作与姿态；若没有提供原图，则使用人物设定中的姿势与动作。角色及服装、配饰从头顶至脚底完整入镜，不得超出画面边界' : line),
          ...(!scene.enabled ? [
            mode === 'four' ? '浅灰无缝影棚背景' : '简洁背景，主体轮廓清晰',
          ] : []),
          ratio && '画面比例 ' + ratio,
          group?.interaction && '两人互动：' + group.interaction,
        ]);
        const characterBlocks = group
          ? group.roles.flatMap((role, index) => {
              if (!role) return [];
              const position = index === 0 ? '画面左侧' : '画面右侧';
              return [
                '## 角色' + (index + 1) + ' · ' + position + ' · ' + role.name,
                role.action ? '动作：' + role.action : '',
                ...characterPromptBlocks(role.values, readCustomFields(role), false),
              ];
            })
          : [
              ...characterPromptBlocks(values, customFields, mode === 'face'),
              ...(!['four', 'face'].includes(mode) && poseLines.length ? [
                section('姿势与动作', [
                  ...(mode === 'five' ? ['以下动作仅在未提供原图时用于第五分区'] : []),
                  ...(mode === 'poses' ? ['以下动作适用于造型展示姿态'] : []),
                  ...poseLines,
                ]),
                '',
              ] : []),
            ];
        const blocks = [
          '# ' + (group ? '多人同框 · 双人' : name + '｜原创角色 · ' + title),
          '',
          ...(group ? [composition, '', ...characterBlocks] : [...characterBlocks, composition, '']),
          section('06 · 材质与画面质量', [
            quality,
            '清晰的主体轮廓与可信的材质细节',
            '画面无水印和叠加文字',
          ]),
          ...scene.blocks.flatMap((block) => ['', block]),
        ];
        const out = incomplete ? '' : blocks.join('\n');
        document.getElementById('copy').disabled = Boolean(incomplete);
        document.getElementById('txt').disabled = Boolean(incomplete);
        document.getElementById('output').value = out;
        document.getElementById('counter').textContent =
          incomplete ? '请先在出图设置中为左右站位各选一个角色。' :
          `约 ${out.length} 字符 · ${title}${ratio ? ' · ' + ratio : ''}`;
        const issues = detectConflicts(),
          notice = document.getElementById('conflictNotice');
        notice.style.display = issues.length ? 'block' : 'none';
        notice.textContent = issues.length
          ? '搭配提醒：' + issues.join('；') + '。请检查对应参数。'
          : '';
        updateIntegrity();
      }
      function download(name, text, type) {
        const a = document.createElement('a');
        const u = URL.createObjectURL(new Blob([text], { type }));
        a.href = u;
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(u), 1000);
      }
      function config() {
        return {
          version: '1.5',
          name: document.getElementById('characterName').value,
          values,
          customFields: [...customFields],
          outputSettings: { ...outputSettings },
          sceneSettings: copySceneSettings(),
        };
      }
      document
        .getElementById('preset')
        .addEventListener('change', (e) => applyPreset(e.target.value));
      document.getElementById('restorePlan').onclick = () => {
        if (activePlan) applyPreset(activePlan);
      };
      document.getElementById('reset').onclick = () => {
        renderPresetSelect('mist');
        applyPreset('mist');
      };
      document.getElementById('characterName').addEventListener('input', () => generate());
      document.getElementById('copy').onclick = async () => {
        const t = document.getElementById('output').value;
        try {
          await navigator.clipboard.writeText(t);
        } catch {
          const el = document.getElementById('output');
          el.select();
          document.execCommand('copy');
        }
        document.getElementById('copy').textContent = '已复制';
        setTimeout(() => (document.getElementById('copy').textContent = '复制提示词'), 1500);
      };
      document.getElementById('txt').onclick = () =>
        download(
          '角色出图提示词.txt',
          document.getElementById('output').value,
          'text/plain;charset=utf-8',
        );
      document.getElementById('save').onclick = () =>
        download('角色参数配置.json', JSON.stringify(config(), null, 2), 'application/json');
      document.getElementById('loadJson').onclick = () =>
        document.getElementById('fileJson').click();
      document.getElementById('fileJson').onchange = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        try {
          const c = JSON.parse(await f.text());
          if (!c.values) throw Error();
          fields.forEach((field) => {
            if (typeof c.values[field[0]] === 'string') values[field[0]] = c.values[field[0]];
          });
          document.getElementById('characterName').value = c.name || '导入角色';
          baseline = { ...values };
          activePlan = '';
          render();
          document.getElementById('presetInfo').textContent =
            '已导入参数配置，可保存为我的造型方案。';
        } catch {
          alert('配置文件格式不正确');
        }
        e.target.value = '';
      };
      document.getElementById('addOption').onclick = () => {
        const id = document.getElementById('addField').value,
          v = document.getElementById('addValue').value.trim(),
          f = fields.find((x) => x[0] === id);
        if (!v) {
          alert('请先填写新选项');
          return;
        }
        if (allOptions(f).includes(v)) {
          alert('该选项已存在');
          return;
        }
        (extras[id] ??= []).push(v);
        localStorage.setItem(key, JSON.stringify(extras));
        customFields.add(id);
        values[id] = v;
        render();
        updateIntegrity();
        document.getElementById('addValue').value = '';
        document.getElementById('optionMsg').textContent = '已添加到「' + f[1] + '」下拉选项库';
      };
      document.getElementById('exportLibrary').onclick = () =>
        download('自定义提示词库.json', JSON.stringify(extras, null, 2), 'application/json');
      document.getElementById('importLibrary').onclick = () =>
        document.getElementById('libraryFile').click();
      document.getElementById('libraryFile').onchange = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        try {
          const o = JSON.parse(await f.text());
          if (!o || Array.isArray(o) || typeof o !== 'object') throw Error();
          for (const [k, arr] of Object.entries(o)) {
            if (!fields.some((x) => x[0] === k) || !Array.isArray(arr)) continue;
            extras[k] = [
              ...new Set([
                ...(extras[k] || []),
                ...arr.filter((x) => typeof x === 'string' && x.trim()),
              ]),
            ];
          }
          localStorage.setItem(key, JSON.stringify(extras));
          render();
          document.getElementById('optionMsg').textContent = '选项库导入成功';
        } catch {
          alert('选项库文件格式不正确');
        }
        e.target.value = '';
      };
      document.getElementById('savePreset').onclick = () => {
        const name = prompt(
          '为当前完整造型方案命名：',
          document.getElementById('characterName').value.trim() || '我的造型',
        );
        if (!name || !name.trim()) return;
        const id = 'plan_' + Date.now();
        customPresets[id] = { name: name.trim(), values: { ...values }, customFields: [...customFields] };
        try {
          localStorage.setItem(customPresetKey, JSON.stringify(customPresets));
        } catch {
          alert('本地存储不可用，请改用保存配置 JSON');
          return;
        }
        renderPresetSelect('custom:' + id);
        activePlan = 'custom:' + id;
        baseline = { ...values };
        updateIntegrity();
        document.getElementById('presetInfo').textContent =
          '已保存完整造型方案「' + name.trim() + '」，以后可从同一菜单加载。';
      };
      document.getElementById('deletePreset').onclick = () => {
        const k = document.getElementById('preset').value;
        if (!k.startsWith('custom:')) {
          alert('内置方案不可删除，请先选择「我的保存方案」');
          return;
        }
        if (!confirm('确定删除这个已保存的造型方案吗？')) return;
        delete customPresets[k.slice(7)];
        localStorage.setItem(customPresetKey, JSON.stringify(customPresets));
        renderPresetSelect('mist');
        activePlan = '';
        baseline = { ...values };
        updateIntegrity();
        document.getElementById('presetInfo').textContent = '已删除保存方案，当前编辑参数未改变。';
      };
      // 初始化延后到所有视觉模块与图片映射定义完成后。

