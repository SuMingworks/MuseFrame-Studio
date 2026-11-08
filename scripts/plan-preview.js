      const legacyImageFiles = {
        mist: 'mist-blue.png',
        gothic: 'gothic-sweet.png',
        college: 'street-academy.png',
        lolita: 'garden-lolita.png',
        punk: 'dark-punk.png',
        y2k: 'y2k-rainbow-sport.png',
        strawberry: 'retro-strawberry.png',
        future: 'blue-silver-idol.png',
        dream: 'pastel-idol.png',
        navy: 'navy-academy.png',
      };
      const imageFiles = Object.fromEntries(
        [...Object.keys(legacyImageFiles), 'starMoon'].map((key) => [
          key,
          builtInPlans[key].label.replace('｜原创示范', '') + '.png',
        ]),
      );
      const descriptions = {
        mist: '雾蓝星屿 · 清冷幻想与银灰星轨',
        gothic: '暗色甜美 · 皮革百褶与银饰',
        college: '都市街头 · 休闲学院风',
        lolita: '古典花园 · 蕾丝与花卉',
        punk: '暗黑机能 · 银灰狼尾与皮革',
        y2k: '千禧运动 · 彩虹拼色',
        strawberry: '复古甜心 · 草莓红与奶白',
        future: '未来舞台 · 蓝白银科技感',
        dream: '梦幻偶像 · 粉蓝薄纱',
        navy: '海军学院 · 蓝白金制服',
        starMoon: '深黑蓝波浪长发与冷灰蓝眼眸，搭配金色星座刺绣的午夜蓝宫廷礼服、弯月星芒发饰、蓝宝石首饰与前短后长的透明星纱裙摆。',
      };
      const palettes = {
        mist: ['#738aa9', '#ede8de', '#a9a8bb', '#5a4e51'],
        gothic: ['#1b1923', '#59515f', '#b5aebd', '#e7e2e9'],
        college: ['#46546b', '#d9d0bc', '#7f8c9d', '#302d33'],
        lolita: ['#c9a5b4', '#f2e7e0', '#b18f79', '#9c9b87'],
        punk: ['#1c1b22', '#777883', '#c1c3ca', '#383942'],
        y2k: ['#f4b6cf', '#9cc8e8', '#f3dc87', '#faf7f1'],
        strawberry: ['#bd344d', '#f7eee5', '#e8a7b3', '#6c9b78'],
        future: ['#375d9e', '#a8c9f4', '#e7edf6', '#b2b8c4'],
        dream: ['#e8a9ce', '#9bc7f4', '#f4e6f2', '#a8a2db'],
        navy: ['#263f6b', '#f7f5ef', '#cfad66', '#91a8c8'],
        starMoon: ['#121c39', '#253354', '#a1b6d0', '#d1b581'],
      };
      const order = [
        'mist',
        'gothic',
        'college',
        'lolita',
        'punk',
        'y2k',
        'strawberry',
        'future',
        'dream',
        'navy',
        'starMoon',
      ];
      function imagePath(k) {
        return imageFiles[k] ? 'images/characters/' + imageFiles[k] : '';
      }
      function showTab(k) {
        document
          .querySelectorAll('[data-tab]')
          .forEach((el) => el.classList.toggle('active', el.dataset.tab === k));
        document
          .querySelectorAll('[data-pane]')
          .forEach((el) => (el.hidden = el.dataset.pane !== k));
      }
      function updateVisual() {
        const k = activePlan,
          plan = builtInPlans[k],
          name = document.getElementById('characterName').value || '自定义角色';
        document.getElementById('sideTitle').textContent = name;
        document.getElementById('sideDesc').textContent =
          descriptions[k] || '已加载自定义造型方案，可继续调整详细参数。';
        const changed = baseline ? fields.filter((f) => values[f[0]] !== baseline[f[0]]) : [];
        const conflicts = detectConflicts();
        document.getElementById('integrityBadge').textContent = conflicts.length
          ? '结构提醒 ' + conflicts.length + ' 项'
          : changed.length
            ? '已修改 ' + changed.length + ' 项'
            : '方案参数已同步';
        document.getElementById('integrityBadge').className =
          'status ' + (conflicts.length ? 'warn' : '');
        document.getElementById('integrityBadgeMini').textContent = conflicts.length
          ? '⚠ ' + conflicts.length + '项结构提醒'
          : changed.length
            ? '已调整 ' + changed.length + ' 项'
            : '✓ 匹配度 100%';
        const chips = document.getElementById('chips');
        chips.innerHTML = '';
        (values.style || '')
          .split(/[，；、]/)
          .slice(0, 3)
          .forEach((x) => {
            if (!x.trim()) return;
            const b = document.createElement('span');
            b.textContent = x.trim().slice(0, 10);
            chips.append(b);
          });
        const colors = document.getElementById('swatches');
        colors.innerHTML = '';
        (palettes[k] || ['#5f5572', '#b2a6c2', '#e8dfed', '#323044']).forEach((c) => {
          const b = document.createElement('i');
          b.style.background = c;
          b.title = c;
          colors.append(b);
        });
        document
          .querySelectorAll('.plan-item')
          .forEach((el) => el.classList.toggle('selected', el.dataset.key === k));
        const img = document.getElementById('mainImage');
        const empty = document.getElementById('imageEmpty');
        if (imagePath(k)) {
          img.style.display = 'block';
          img.onerror = () => {
            img.style.display = 'none';
            empty.hidden = false;
            empty.textContent =
              '未找到预览图片：' + imagePath(k) + '。请确认 images 文件夹及文件名。';
          };
          img.onload = () => {
            img.style.display = 'block';
            empty.hidden = true;
          };
          img.src = imagePath(k);
          empty.hidden = true;
        } else {
          img.removeAttribute('src');
          img.style.display = 'none';
          empty.hidden = false;
          empty.textContent = '此方案尚未配置本地预览图';
        }
        document.getElementById('imageHint').textContent = changed.length
          ? '已修改参数，预览图仍对应原始方案'
          : '图片来自本地 images 文件夹';
      }
      function renderPlanList() {
        const box = document.getElementById('planList');
        box.innerHTML = '';
        const heading = box.parentElement.querySelector('h2 small');
        if (heading)
          heading.textContent = '（' + (order.length + Object.keys(customPresets).length) + '）';
        const entries = [
          ...order.map((k) => [k, builtInPlans[k]?.label, descriptions[k] || '']),
          ...Object.entries(customPresets).map(([id, p]) => [
            'custom:' + id,
            p.name || '未命名角色',
            '我的方案 · 可继续编辑',
          ]),
        ];
        for (const [k, label, desc] of entries) {
          if (!label) continue;
          const btn = document.createElement('button');
          btn.className = 'plan-item';
          btn.dataset.key = k;
          const path = imagePath(k);
          if (path) {
            const im = document.createElement('img');
            im.src = path;
            im.alt = label;
            im.onerror = () => {
              im.style.opacity = '.15';
            };
            btn.append(im);
          } else {
            const placeholder = document.createElement('span');
            placeholder.className = 'custom-thumbnail';
            placeholder.textContent = '✦';
            btn.append(placeholder);
          }
          const meta = document.createElement('span');
          meta.innerHTML = '<strong></strong><small></small>';
          meta.querySelector('strong').textContent = label.replace('｜原创示范', '');
          meta.querySelector('small').textContent = desc;
          btn.append(meta);
          btn.onclick = () => {
            applyPreset(k);
            showTab('params');
          };
          box.append(btn);
        }
        document
          .querySelectorAll('.plan-item')
          .forEach((el) => el.classList.toggle('selected', el.dataset.key === activePlan));
      }
      const priorApply = applyPreset;
      applyPreset = function (k) {
        priorApply(k);
        updateVisual();
      };
      renderPlanList();
      renderPresetSelect('mist');
      applyPreset('mist');
      showTab('params');
      document.getElementById('openImage').onclick = () => {
        const img = document.getElementById('mainImage');
        if (!img.src || img.style.display === 'none') return;
        document.getElementById('modalImg').src = img.src;
        document.getElementById('imageModal').showModal();
      };
      document.getElementById('closeModal').onclick = () =>
        document.getElementById('imageModal').close();
      document.getElementById('generateMain').onclick = () => {
        generate();
        showTab('prompt');
        document
          .getElementById('workspaceTabs')
          .scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      document.getElementById('navLibrary').onclick = () => {
        document.getElementById('libraryPanel').hidden = false;
        document.getElementById('libraryPanel').scrollIntoView({ behavior: 'smooth' });
      };
      document.getElementById('navSaved').onclick = () => {
        document.getElementById('savedPanel').hidden = false;
        document.getElementById('savedPanel').scrollIntoView({ behavior: 'smooth' });
      };
      document.getElementById('navImport').onclick = () =>
        document.getElementById('loadJson').click();
      document.getElementById('navExport').onclick = () => document.getElementById('save').click();
      document.getElementById('closeLibrary').onclick = () =>
        (document.getElementById('libraryPanel').hidden = true);
      document.getElementById('closeSaved').onclick = () =>
        (document.getElementById('savedPanel').hidden = true);
      document
        .querySelectorAll('[data-tab]')
        .forEach((btn) => (btn.onclick = () => showTab(btn.dataset.tab)));

