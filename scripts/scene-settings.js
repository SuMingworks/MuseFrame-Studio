      // V1.5 — Independent scene settings, reusable presets and character/environment integration.
      const scenePresetKey = 'museframe_scene_presets_v15';
      const sceneDefinitions = [
        [
          'category',
          '场景风格',
          ['纯净摄影棚', '国风古典', '国风仙侠', '欧式幻想', '现代都市', '自然风景', '未来科幻'],
        ],
        [
          'location',
          '具体地点',
          [
            '中性摄影棚',
            '江南园林',
            '中式宫苑',
            '竹林幽径',
            '古镇灯市',
            '水墨山河',
            '仙侠云境',
            '云海仙宫',
            '欧式花园',
            '古堡庭院',
            '月光喷泉',
            '现代校园',
            '城市天台',
            '霓虹街道',
            '海滨栈道',
            '森林溪谷',
            '高山草甸',
            '星际舰桥',
            '未来都市',
          ],
        ],
        ['time', '时间', ['不限', '清晨', '正午', '黄昏', '蓝调时刻', '夜晚']],
        ['weather', '天气', ['晴朗', '多云', '薄雾', '细雨', '飘雪', '室内不适用']],
        ['season', '季节', ['不限定', '春季', '夏季', '秋季', '冬季']],
        [
          'lighting',
          '光照类型',
          [
            '柔光棚拍',
            '自然日光',
            '柔和逆光',
            '电影侧光',
            '环境漫射光',
            '月光',
            '霓虹光',
            '灯笼暖光',
          ],
        ],
        ['temperature', '光线色温', ['中性白', '暖金色', '冷蓝色', '粉紫色', '月白色']],
        [
          'mood',
          '环境氛围',
          ['清新明亮', '浪漫梦幻', '雅致宁静', '神秘幽静', '暗黑哥特', '未来科技', '史诗仙侠'],
        ],
        ['complexity', '背景复杂度', ['极简', '适中', '丰富']],
        ['depth', '景深效果', ['全景清晰', '轻微虚化', '浅景深', '强背景虚化']],
        [
          'props',
          '场景道具',
          ['无', '花束', '书籍', '纸伞', '古琴', '折扇', '宫灯', '茶具', '乐器', '科幻设备'],
        ],
        [
          'interaction',
          '人物与环境互动',
          ['无互动', '倚靠栏杆', '站在廊下', '坐在台阶', '行走', '手持道具', '迎风站立'],
        ],
      ];
      // V1.7 — Category-dependent scene locations. Existing V1.6 scenes are preserved.
      const sceneLocationGroups = {
        纯净摄影棚: ['中性摄影棚'],
        国风古典: ['江南园林', '中式宫苑', '竹林幽径', '古镇灯市', '水墨山河'],
        国风仙侠: ['仙侠云境', '云海仙宫'],
        欧式幻想: ['欧式花园', '古堡庭院', '月光喷泉'],
        现代都市: ['现代校园', '城市天台', '霓虹街道'],
        自然风景: ['海滨栈道', '森林溪谷', '高山草甸'],
        未来科幻: ['星际舰桥', '未来都市'],
      };
      const sceneLocationCategory = Object.fromEntries(
        Object.entries(sceneLocationGroups).flatMap(([c, locations]) =>
          locations.map((loc) => [loc, c]),
        ),
      );
      function normalizeSceneLocation() {
        const inferred = sceneLocationCategory[sceneSettings.location];
        if (inferred && sceneSettings.category !== inferred) sceneSettings.category = inferred;
        const allowed =
          sceneLocationGroups[sceneSettings.category] || sceneLocationGroups['纯净摄影棚'];
        if (!allowed.includes(sceneSettings.location)) sceneSettings.location = allowed[0];
      }
      function refreshLocationOptions() {
        const location = document.querySelector('[data-scene-key="location"]');
        if (!location) return;
        const options =
          sceneLocationGroups[sceneSettings.category] || sceneLocationGroups['纯净摄影棚'];
        location.replaceChildren(...options.map((x) => new Option(x, x)));
        if (!options.includes(sceneSettings.location)) sceneSettings.location = options[0];
        location.value = sceneSettings.location;
      }
      const fusionDefinitions = [
        ['strength', '融合强度', ['突出人物', '自然融合', '强调环境']],
        [
          'position',
          '人物位置',
          ['场景中央', '前景', '廊下', '桥上', '窗边', '石阶旁', '建筑入口'],
        ],
        ['action', '人物互动', ['无互动', '自然站姿', '行走', '倚靠栏杆', '坐姿', '手持道具']],
        [
          'light',
          '光影匹配',
          ['自动匹配', '柔和逆光', '电影侧光', '环境漫射光', '月光匹配', '灯光匹配'],
        ],
        ['color', '色彩协调', ['保留人物原色', '统一色调但保留服装固有色', '环境色轻微影响']],
        [
          'response',
          '环境响应',
          [
            '接触阴影＋环境反射＋发丝衣料受光',
            '接触阴影＋自然边缘光',
            '轻度环境响应',
            '完整环境材质响应',
          ],
        ],
      ];
      const sceneDefaults = {
        enabled: false,
        fusionEnabled: false,
        category: '纯净摄影棚',
        location: '中性摄影棚',
        time: '不限',
        weather: '室内不适用',
        season: '不限定',
        lighting: '柔光棚拍',
        temperature: '中性白',
        mood: '清新明亮',
        complexity: '极简',
        depth: '全景清晰',
        props: '无',
        interaction: '无互动',
        custom: '',
        strength: '自然融合',
        position: '场景中央',
        action: '自然站姿',
        light: '自动匹配',
        color: '保留人物原色',
        response: '接触阴影＋环境反射＋发丝衣料受光',
      };
      let sceneSettings = { ...sceneDefaults };
      let sceneWasEdited = false;
      function copySceneSettings() {
        return { ...sceneSettings };
      }
      function readScenePresets() {
        try {
          const p = JSON.parse(localStorage.getItem(scenePresetKey) || '{}');
          return p && typeof p === 'object' && !Array.isArray(p) ? p : {};
        } catch {
          return {};
        }
      }
      function writeScenePresets(p) {
        localStorage.setItem(scenePresetKey, JSON.stringify(p));
      }
      const automaticSceneChoices = { lighting: '自动匹配场景光照', action: '自动沿用场景互动' };
      function sceneField(def, container) {
        const [key, label, choices] = def;
        const wrapper = document.createElement('label');
        wrapper.textContent = label;
        const select = document.createElement('select');
        select.dataset.sceneKey = key;
        if (Object.hasOwn(automaticSceneChoices, key))
          select.add(new Option(automaticSceneChoices[key], ''));
        for (const choice of choices) {
          const opt = document.createElement('option');
          opt.value = choice;
          opt.textContent = choice;
          select.append(opt);
        }
        select.addEventListener('change', () => {
          sceneSettings[key] = select.value || sceneDefaults[key];
          sceneSettings.explicit = { ...sceneSettings.explicit, [key]: select.value !== '' };
          if (key === 'category') {
            sceneSettings.location = (sceneLocationGroups[select.value] || [])[0] || '中性摄影棚';
            refreshLocationOptions();
          }
          if (key === 'location') {
            sceneSettings.category = sceneLocationCategory[select.value] || sceneSettings.category;
          }
          sceneChanged(key);
        });
        wrapper.append(select);
        container.append(wrapper);
      }
      sceneDefinitions.forEach((d) => sceneField(d, document.getElementById('sceneFields')));
      fusionDefinitions.forEach((d) => sceneField(d, document.getElementById('fusionFields')));
      const customSceneLabel = document.createElement('label');
      customSceneLabel.className = 'wide';
      customSceneLabel.textContent = '额外场景描述（自定义）';
      const customSceneInput = document.createElement('textarea');
      customSceneInput.id = 'sceneCustom';
      customSceneInput.placeholder = '例如：水面倒映亭台，风吹动衣角，远景自然虚化……';
      customSceneInput.addEventListener('input', () => {
        sceneSettings.custom = customSceneInput.value;
        sceneChanged();
      });
      customSceneLabel.append(customSceneInput);
      document.getElementById('sceneFields').append(customSceneLabel);
      function setSceneSettings(obj, edited) {
        const incoming = obj && typeof obj === 'object' ? obj : {};
        sceneSettings = { ...sceneDefaults, ...incoming };
        normalizeSceneLocation();
        sceneWasEdited = Boolean(edited);
        syncSceneControls();
        refreshSceneSummary();
        generate();
      }
      function syncSceneControls() {
        normalizeSceneLocation();
        refreshLocationOptions();
        document.getElementById('sceneEnabled').checked = !!sceneSettings.enabled;
        document.getElementById('fusionEnabled').checked = !!sceneSettings.fusionEnabled;
        for (const sel of document.querySelectorAll('[data-scene-key]')) {
          const key = sel.dataset.sceneKey;
          const val = Object.hasOwn(automaticSceneChoices, key) &&
            !sceneSettings.explicit?.[key] && sceneSettings[key] === sceneDefaults[key]
            ? ''
            : sceneSettings[key];
          if ([...sel.options].some((o) => o.value === val)) sel.value = val;
          else sel.selectedIndex = 0;
        }
        customSceneInput.value = sceneSettings.custom || '';
      }
      function refreshSceneSummary() {
        const enabled = sceneSettings.enabled;
        document.getElementById('sceneSummary').textContent = enabled
          ? `场景：${sceneSettings.category} · ${sceneSettings.location} · ${sceneSettings.time} · ${sceneSettings.lighting}；融合：${sceneSettings.fusionEnabled ? sceneSettings.strength + ' · ' + sceneSettings.color : '关闭'}。角色服装固有色与五官设定不随场景改变。`
          : '场景关闭：保持当前出图模式的纯净背景要求；人物造型保持不变。';
      }
      function sceneChanged() {
        sceneWasEdited = true;
        refreshSceneSummary();
        generate();
        storeDraft();
      }
      document.getElementById('sceneEnabled').addEventListener('change', (e) => {
        sceneSettings.enabled = e.target.checked;
        if (e.target.checked && outputSettings.mode === 'poster')
          sceneSettings.fusionEnabled = true;
        syncSceneControls();
        sceneChanged();
      });
      document.getElementById('fusionEnabled').addEventListener('change', (e) => {
        sceneSettings.fusionEnabled = e.target.checked;
        sceneChanged();
      });
      document.querySelectorAll('[data-scene-tab]').forEach((b) =>
        b.addEventListener('click', () => {
          for (const btn of document.querySelectorAll('[data-scene-tab]'))
            btn.classList.toggle('active', btn === b);
          document.getElementById('scenePane').hidden = b.dataset.sceneTab !== 'scene';
          document.getElementById('fusionPane').hidden = b.dataset.sceneTab !== 'fusion';
        }),
      );
      function refreshScenePresetList() {
        const el = document.getElementById('scenePreset');
        const previous = el.value;
        el.replaceChildren(new Option('加载我的场景方案', ''));
        for (const name of Object.keys(readScenePresets()).sort()) el.add(new Option(name, name));
        if ([...el.options].some((o) => o.value === previous)) el.value = previous;
      }
      document.getElementById('saveScenePreset').onclick = () => {
        const name = prompt(
          '为当前场景命名：',
          sceneSettings.location + ' · ' + sceneSettings.time,
        );
        if (!name || !name.trim()) return;
        const p = readScenePresets();
        const k = name.trim();
        if (p[k] && !confirm('场景预设已存在，是否覆盖？')) return;
        p[k] = copySceneSettings();
        try {
          writeScenePresets(p);
          refreshScenePresetList();
          document.getElementById('scenePreset').value = k;
          alert('场景方案已保存：' + k);
        } catch {
          alert('保存失败，请检查浏览器存储空间');
        }
      };
      document.getElementById('updateScenePreset').onclick = () => {
        const name = document.getElementById('scenePreset').value;
        if (!name) {
          alert('请先从「加载我的场景方案」选择一个已保存的方案');
          return;
        }
        const p = readScenePresets();
        if (!p[name]) return;
        p[name] = copySceneSettings();
        try {
          writeScenePresets(p);
          storeDraft();
          alert('已更新场景方案：' + name);
        } catch {
          alert('保存失败');
        }
      };
      document.getElementById('scenePreset').onchange = (e) => {
        const p = readScenePresets()[e.target.value];
        if (p) {
          setSceneSettings(p, true);
          storeDraft();
        }
      };
      document.getElementById('deleteScenePreset').onclick = () => {
        const k = document.getElementById('scenePreset').value;
        if (!k) return;
        if (!confirm('删除场景预设「' + k + '」？')) return;
        const p = readScenePresets();
        delete p[k];
        writeScenePresets(p);
        refreshScenePresetList();
      };
      // V1.8: every output-mode switch applies that mode's default, regardless of prior scene edits.
      // Scene parameters are retained; only the two enable switches change.
      const v15ModeChange = document.getElementById('outputMode');
      v15ModeChange.addEventListener('change', () => {
        const poster = outputSettings.mode === 'poster';
        sceneSettings.enabled = poster;
        sceneSettings.fusionEnabled = poster;
        sceneWasEdited = false;
        syncSceneControls();
        refreshSceneSummary();
        generate();
        storeDraft();
      });
      refreshScenePresetList();
      syncSceneControls();
      refreshSceneSummary();
      generate();

