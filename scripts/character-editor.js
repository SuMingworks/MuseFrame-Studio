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
      const builtInPlans = {
        mist: { label: '雾蓝星屿｜原创示范' },
        ...{
          punk: {
            label: '暗黑朋克少女',
            style: 1,
            face: 5,
            eyes: 4,
            iris: 3,
            makeup: 3,
            hair: 5,
            bangs: 4,
            accessory: 8,
            socks: 3,
            shoes: 3,
            palette: 3,
            mood: 1,
            body: 2,
            neckline: 6,
            sleeve: 0,
            fabric: 8,
            pattern: 6,
            neckjewelry: 3,
            outfitDetail: 2,
            top: '炭黑短版机车革面外套，宽翻领、斜拉链、银色扣件与肩部接片清楚；内搭深灰贴身背心，袖口与背部缝线完整',
            bottom: '黑色高腰微A形短裙，裙片利落，侧腰金属扣带与可拆卸链条装饰，后片接缝与前片统一',
          },
          gothic: {
            label: '哥特甜酷少女',
            style: 2,
            face: 4,
            eyes: 2,
            iris: 3,
            makeup: 4,
            hair: 6,
            bangs: 4,
            accessory: 8,
            socks: 3,
            shoes: 4,
            palette: 4,
            mood: 1,
            body: 2,
            neckline: 3,
            sleeve: 0,
            fabric: 8,
            pattern: 6,
            neckjewelry: 2,
            outfitDetail: 2,
            top: '黑色短版皮革翻领外套，银色拉链与扣带细节，内搭冷白色修身罗纹上衣；前后肩线、衣摆和袖口结构明确',
            bottom:
              '黑色高腰立体百褶短裙，宽腰带与银色链条沿腰侧悬垂，裙褶从腰部向裙缘连续展开，后视褶距统一',
          },
          y2k: {
            label: 'Y2K彩虹运动',
            style: 3,
            face: 1,
            eyes: 3,
            iris: 2,
            makeup: 1,
            hair: 1,
            bangs: 2,
            accessory: 4,
            socks: 7,
            shoes: 5,
            palette: 5,
            mood: 2,
            body: 1,
            neckline: 8,
            sleeve: 0,
            fabric: 2,
            pattern: 3,
            neckjewelry: 6,
            outfitDetail: 3,
            top: '粉蓝黄拼色短版拉链运动夹克，轻薄防风织物，撞色袖片与罗纹袖口；内搭白色圆领短上衣',
            bottom: '奶白色高腰运动短裤，粉蓝侧边条纹，松紧腰头与口袋缝线清楚，裤腿长度对称',
          },
          college: {
            label: '美式街头学院',
            style: 4,
            face: 2,
            eyes: 0,
            iris: 2,
            makeup: 0,
            hair: 8,
            bangs: 3,
            accessory: 3,
            socks: 7,
            shoes: 5,
            palette: 6,
            mood: 2,
            body: 1,
            neckline: 8,
            sleeve: 0,
            fabric: 2,
            pattern: 3,
            neckjewelry: 6,
            outfitDetail: 1,
            top: '酒红与黑色拼色短版棒球夹克，罗纹领口与袖口、按扣门襟、学院徽章；内搭奶白色棉质上衣',
            bottom: '黑色高腰百褶短裙，褶距均匀、裙腰贴合，背面延续相同褶片与缝线',
          },
          strawberry: {
            label: '复古草莓甜心',
            style: 5,
            face: 1,
            eyes: 1,
            iris: 2,
            makeup: 5,
            hair: 7,
            bangs: 1,
            accessory: 4,
            socks: 1,
            shoes: 6,
            palette: 7,
            mood: 2,
            body: 1,
            neckline: 4,
            sleeve: 1,
            fabric: 6,
            pattern: 1,
            neckjewelry: 4,
            outfitDetail: 5,
            top: '奶白色短款泡泡袖甜心领上衣，红色细缎带与蕾丝滚边，袖山蓬起、袖口轻收',
            bottom: '草莓红与奶白配色层叠短裙，红白散点圆纹均匀，裙缘荷叶边与小型蝴蝶结错落分布',
          },
          lolita: {
            label: '古典花园洛丽塔',
            style: 6,
            face: 1,
            eyes: 1,
            iris: 2,
            makeup: 6,
            hair: 11,
            bangs: 1,
            accessory: 5,
            socks: 4,
            shoes: 6,
            palette: 8,
            mood: 1,
            body: 1,
            neckline: 9,
            sleeve: 1,
            fabric: 6,
            pattern: 4,
            neckjewelry: 5,
            outfitDetail: 5,
            top: '奶茶粉色古典洋装上身，蕾丝花边立领、短泡泡袖、收腰拼片与前胸缎带结饰；肩部与背部缝合关系完整',
            bottom:
              '象牙白与奶茶粉层叠钟形蓬蓬裙，裙撑体积适中，裙缘立体花形与多层蕾丝滚边，背面同样完整',
          },
          future: {
            label: '蓝银未来偶像',
            style: 7,
            face: 5,
            eyes: 4,
            iris: 1,
            makeup: 7,
            hair: 9,
            bangs: 3,
            accessory: 7,
            socks: 5,
            shoes: 7,
            palette: 9,
            mood: 1,
            body: 2,
            neckline: 6,
            sleeve: 0,
            fabric: 4,
            pattern: 7,
            neckjewelry: 3,
            outfitDetail: 6,
            top: '蓝白银短版未来舞台夹克，不对称肩片、金属感包边与细几何纹理，内搭银白修身上衣',
            bottom:
              '蓝银色分片舞台短裙，硬挺结构片与柔软裙片交替，腰部科技感扣件固定，后片设计完整',
          },
          dream: {
            label: '粉蓝梦幻偶像',
            style: 8,
            face: 1,
            eyes: 3,
            iris: 1,
            makeup: 6,
            hair: 11,
            bangs: 1,
            accessory: 4,
            socks: 5,
            shoes: 7,
            palette: 5,
            mood: 2,
            body: 1,
            neckline: 4,
            sleeve: 1,
            fabric: 5,
            pattern: 5,
            neckjewelry: 4,
            outfitDetail: 6,
            top: '粉蓝拼色短款偶像舞台上衣，甜心领、蓬起短袖、蓝粉缎带与珍珠感滚边，收腰拼片清晰',
            bottom: '粉蓝渐变层叠舞台短裙，欧根纱与细褶裙片交错，腰侧蝴蝶结与后视裙层相互对应',
          },
          navy: {
            label: '海军学院偶像',
            style: 9,
            face: 2,
            eyes: 3,
            iris: 2,
            makeup: 1,
            hair: 7,
            bangs: 1,
            accessory: 7,
            socks: 6,
            shoes: 7,
            palette: 10,
            mood: 2,
            body: 1,
            neckline: 7,
            sleeve: 7,
            fabric: 2,
            pattern: 3,
            neckjewelry: 6,
            outfitDetail: 7,
            top: '海军蓝与奶白配色短袖海军领上衣，金色细滚边、胸前蓝色缎带结饰与明确的前后领片',
            bottom: '海军蓝高腰百褶短裙，金色细滚边沿裙缘分布，褶片对称且背部延续相同设计',
          },
        },
      };
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
        result.style = fields.find((f) => f[0] === 'style')[2][p.style];
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
          : '当前25项参数与已加载方案完全一致';
        el.textContent =
          status +
          (conflicts.length ? '。结构提醒：' + conflicts.join('；') : '。未检测到已知的结构冲突');
        el.className = 'notice ' + (conflicts.length ? 'integrity-warn' : '');
      }
      function allOptions(f) {
        return [...f[2], ...(extras[f[0]] || [])];
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
            for (const opt of allOptions(f)) {
              const o = document.createElement('option');
              o.value = opt;
              o.textContent = opt.length > 38 ? opt.slice(0, 38) + '…' : opt;
              sel.append(o);
            }
            if (!allOptions(f).includes(values[id])) {
              const o = document.createElement('option');
              o.value = values[id];
              o.textContent = '当前自定义描述';
              sel.append(o);
            }
            sel.value = values[id];
            const edit = document.createElement('textarea');
            edit.id = 'edit_' + id;
            edit.value = values[id];
            edit.rows = 3;
            edit.className = 'field-edit';
            sel.onchange = () => {
              if (f[2].includes(sel.value)) customFields.delete(id);
              else customFields.add(id);
              values[id] = sel.value;
              edit.value = sel.value;
              generate();
              updateVisual();
            };
            edit.oninput = () => {
              customFields.add(id);
              values[id] = edit.value;
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
          return [key, appearance];
        }));
      })();
      // Later scripts supply settings after their controls and state are initialized.
      let promptOutput = () => ({ mode: 'four', title: '四视图摄影与一致性', framing: [] });
      let promptScene = () => ({ enabled: false, blocks: [] });
      function generate() {
        const v = Object.fromEntries(fields.map(([key]) => {
          const value = values[key];
          return [key, customFields.has(key) ? value : (builtInAppearance[key].get(value) ?? value)];
        }));
        const name = document.getElementById('characterName').value.trim() || '未命名角色';
        const { mode, title, framing, ratio, quality } = promptOutput();
        const scene = promptScene(mode);
        const portrait = mode === 'face';
        const blocks = [
          '# ' + name + '｜原创角色 · ' + title,
          '',
          section('01 · 美术定位', [
            '原创成年女性角色',
            v.style,
            v.mood,
            '统一服装轮廓、色彩节奏与人物气质，避免直接复制现有角色',
          ]),
          '',
          section('02 · 人物识别', [
            '面型：' + v.face,
            '眉形：' + v.brow,
            '眼睑与眼型：' + v.eyes,
            '虹膜：' + v.iris,
            '鼻部：' + v.nose,
            '唇部：' + v.lips,
            '皮肤：' + v.skin,
            '妆容：' + v.makeup,
          ]),
          '',
          section('03 · 发型与服装', [
            '发型：' + v.hair,
            '刘海：' + v.bangs,
            '发饰与耳饰：' + v.accessory,
            '上衣：' + v.top,
            '领部：' + v.neckline,
            ...(!portrait ? [
              '袖部：' + v.sleeve,
              '下装：' + v.bottom,
              '袜类：' + v.socks,
              '鞋履：' + v.shoes,
            ] : []),
            '配色：' + v.palette,
            '材料：' + v.fabric,
            '图案：' + v.pattern,
            '颈部饰件：' + v.neckjewelry,
            ...(!portrait ? ['剪裁与层级：' + v.outfitDetail] : []),
          ]),
          '',
          ...(portrait ? [] : [
            section('04 · 人体比例', [
              v.body,
              '保持可信的人体比例与关节结构',
            ]),
            '',
          ]),
          section('05 · ' + title, [
            ...framing,
            ...(!scene.enabled ? [
              mode === 'four' ? '浅灰无缝影棚背景' : '简洁背景，主体轮廓清晰',
            ] : []),
            ratio && '画面比例 ' + ratio,
          ]),
          '',
          section('06 · 材质与画面质量', [
            quality,
            '清晰的主体轮廓与可信的材质细节',
            '画面无水印和叠加文字',
          ]),
          ...scene.blocks.flatMap((block) => ['', block]),
        ];
        const out = blocks.join('\n');
        document.getElementById('output').value = out;
        document.getElementById('counter').textContent =
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

