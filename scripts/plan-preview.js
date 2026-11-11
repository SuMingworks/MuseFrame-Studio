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
        [...Object.keys(legacyImageFiles), 'starTearBride', 'azureWave', 'cherrySweetheart', 'moonlitDancer', 'crimsonBlossom', 'peachSatin', 'inkTassel', 'duskSakura', 'moonWhiteDream', 'crimsonPhantom', 'starMoon', 'morningDew', 'berryStarCandy', 'neonPatrol', 'tidalGlass', 'creamWhisper', 'inkFrost', 'nightVelvet', 'mintPhantom', 'obsidianSweet', 'amethystButterfly', 'nightBanquet'].map((key) => [
          key,
          builtInPlans[key].label.replace('｜原创示范', '') + '.png',
        ]),
      );
      const descriptions = {
        nightBanquet: '午夜夜宴 · 黑棕银灰挑染短发、高领深V开衩礼服与香槟杯',
        amethystButterfly: '紫晶花神 · 薰衣草紫花瓣胸衣、透明蝶翼裙摆与水晶高跟凉鞋',
        starTearBride: '冰蓝花嫁 · 白色蕾丝胸杯礼服、冰蓝蓬纱与新娘头纱',
        azureWave: '碧波仙舞 · 冰蓝珠绣抹胸、低腰高开衩长裙与透明披帛',
        cherrySweetheart: '樱桃甜心 · 奶白吊带裙、红樱桃印花与蕾丝花边',
        moonlitDancer: '月华仙舞 · 珍珠白抹胸、高开衩长裙与透明水袖披帛',
        crimsonBlossom: '红金花神 · 绯红丝缎礼服、金线花枝刺绣与红宝石珠宝',
        peachSatin: '缎梦芭蕾 · 珍珠白灯笼裙、粉白蝴蝶结与厚底玛丽珍鞋',
        inkTassel: '新中式雅韵 · 黑色改良旗袍、金色盘扣与流苏配件',
        duskSakura: '清雅学院 · 浅雾蓝褶皱衬衫、黑色高腰吊带裙与蕾丝过膝袜',
        moonWhiteDream: '蕾丝轻语 · 象牙白露肩蕾丝上衣、垂坠长裤与毛绒拖鞋',
        crimsonPhantom: '蕾丝缪斯 · 鲜红挂脖蕾丝镂空裙、蕾丝长手套与黑色漆皮高跟鞋',
        obsidianSweet: '夜猫少女 · 黑色猫咪图案露腰短T、蕾丝层叠蓬蓬裙与漆皮厚底玛丽珍鞋',
        nightVelvet: '都市时装 · 深藏蓝高领、灰色短裙与黑色长发',
        mintPhantom: '甜酷撞色 · 黑色连体短裤、薄荷青过膝袜与漆皮高跟鞋',
        mist: '雾蓝星屿 · 清冷幻想与银灰星轨',
        inkFrost: '都市冷艳 · 黑色高领修身裙与银色吊坠',
        creamWhisper: '冬日柔甜 · 奶油毛绒帽与蕾丝针织',
        tidalGlass: '深海潮汐 · 海玻璃肩饰与银蓝流体裙装',
        neonPatrol: '近未来夜巡 · 黑青机能服与琥珀眼眸',
        berryStarCandy: '原宿甜酷 · 樱花粉长卷发、星星贝雷帽与粉蓝不对称街装',
        morningDew: '春日花园 · 薄荷蓝绿与奶油黄蕾丝',
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
        nightBanquet: ['#0c0c10', '#2a2a30', '#c9ccd2', '#e8d5cc'],
        amethystButterfly: ['#b39ada', '#e2d6f2', '#f5f1fa', '#8d76c4'],
        starTearBride: ['#d7e9f5', '#f8f5f0', '#9cc5dc', '#c9a75c'],
        azureWave: ['#bfe3e8', '#7fc6cf', '#e8f4f4', '#171416'],
        cherrySweetheart: ['#f7efe5', '#c82435', '#7a1422', '#3f5b3a'],
        moonlitDancer: ['#f4f1ea', '#dfe4e6', '#b9bec2', '#171416'],
        crimsonBlossom: ['#7a0b1e', '#c81f3a', '#d4af6a', '#f2e6da'],
        peachSatin: ['#f4efe6', '#f3c9d4', '#e8d3a9', '#d9d4cf'],
        inkTassel: ['#101013', '#26262b', '#c8a35a', '#efe4d8'],
        duskSakura: ['#b7cfdf', '#121216', '#2a211f', '#e8cdbb'],
        moonWhiteDream: ['#ece4d8', '#d8c9b7', '#3b302b', '#d9d9d6'],
        crimsonPhantom: ['#c8102e', '#6e0712', '#111014', '#e8cbb8'],
        obsidianSweet: ['#131316', '#2b2a30', '#c6c9cf', '#f0dfd2'],
        nightVelvet: ['#172039', '#aaa9ac', '#1b1a1d', '#d8b8aa'],
        mintPhantom: ['#141416', '#43dfc0', '#2c2325', '#f0d5c8'],
        mist: ['#738aa9', '#ede8de', '#a9a8bb', '#5a4e51'],
        inkFrost: ['#171719', '#302725', '#eee9df', '#a6a6a8'],
        creamWhisper: ['#f4ecdc', '#dfd2c0', '#3b2928', '#d4a5a8'],
        tidalGlass: ['#17354c', '#79b9b3', '#aabfcb', '#dce9e7'],
        neonPatrol: ['#202528', '#28665f', '#a4adb0', '#d18b3d'],
        berryStarCandy: ['#f2a9c4', '#a9cde5', '#fff4e5', '#b198bf'],
        morningDew: ['#a8d8cc', '#f5e3a6', '#fff8eb', '#a8795d'],
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
        'nightBanquet',
        'amethystButterfly',
        'starTearBride',
        'azureWave',
        'cherrySweetheart',
        'moonlitDancer',
        'crimsonBlossom',
        'peachSatin',
        'inkTassel',
        'duskSakura',
        'moonWhiteDream',
        'crimsonPhantom',
        'obsidianSweet',
        'nightVelvet',
        'mintPhantom',
        'mist',
        'inkFrost',
        'creamWhisper',
        'tidalGlass',
        'neonPatrol',
        'berryStarCandy',
        'morningDew',
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
        updateFaceCheck();
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
            if (k !== activePlan && applyPreset(k)) showTab('params');
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
        openImageViewer(img.src);
      };
      const imageModalEl = document.getElementById('imageModal');
      const modalImageEl = document.getElementById('modalImg');
      const viewerCaptionEl = document.getElementById('viewerCaption');
      const toggleFullscreenButton = document.getElementById('toggleFullscreen');
      const closeModalButton = document.getElementById('closeModal');
      let viewerMode = 'character';
      let viewerList = [];
      let viewerIndex = -1;
      let viewerCaptionText = '';

      function viewerName(key) {
        return (builtInPlans[key]?.label || key).replace('｜原创示范', '');
      }
      function viewerCharacterList() {
        return order.filter((key) => builtInPlans[key] && imagePath(key));
      }
      function updateViewerChrome() {
        const canSwitch =
          viewerMode === 'character' && viewerIndex >= 0 && viewerList.length > 1;
        document.getElementById('prevImage').hidden = !canSwitch;
        document.getElementById('nextImage').hidden = !canSwitch;
        viewerCaptionEl.hidden = !viewerCaptionText;
        viewerCaptionEl.textContent = viewerCaptionText;
      }
      function currentFullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || null;
      }
      function viewerHint(text, duration = 5000) {
        const hint = document.getElementById('viewerHint');
        if (!hint) return;
        clearTimeout(viewerHint.timer);
        hint.textContent = text;
        hint.hidden = false;
        viewerHint.timer = setTimeout(() => {
          hint.hidden = true;
        }, duration);
      }
      function clearViewerHint() {
        const hint = document.getElementById('viewerHint');
        if (!hint) return;
        clearTimeout(viewerHint.timer);
        hint.hidden = true;
      }
      function updateFullscreenButton() {
        const active = Boolean(currentFullscreenElement());
        toggleFullscreenButton.textContent = active ? '⛶ 退出全屏' : '⛶ 全屏';
        toggleFullscreenButton.setAttribute('aria-pressed', String(active));
        // 全屏时退出全屏即关闭预览，不再单独显示“关闭”按钮；
        // 仅在浏览器拒绝全屏、退化为页面内查看时才保留“关闭”。
        closeModalButton.hidden = active;
      }
      function fullscreenDeniedHint() {
        viewerHint('浏览器未允许全屏，可按 F11 隐藏浏览器界面');
      }
      function requestViewerFullscreen() {
        if (currentFullscreenElement()) return;
        if (document.fullscreenEnabled === false) {
          fullscreenDeniedHint();
          return;
        }
        // 全屏请求挂在文档根节点上。对话框本身已在顶层（top layer），
        // Chrome 会对 dialog.requestFullscreen() 直接报 "Dialog elements are invalid"。
        const root = document.documentElement;
        const request = root.requestFullscreen || root.webkitRequestFullscreen;
        if (!request) {
          viewerHint('当前浏览器不支持网页全屏，可按 F11 隐藏浏览器界面');
          return;
        }
        try {
          const result = request.call(root, { navigationUI: 'hide' });
          if (result && typeof result.then === 'function') {
            result.then(
              () => {
                // 全屏批准得比关闭预览还晚时，不要把页面留在全屏里。
                if (!imageModalEl.open) exitViewerFullscreen();
              },
              fullscreenDeniedHint
            );
          }
        } catch (error) {
          fullscreenDeniedHint();
        }
      }
      function exitViewerFullscreen() {
        if (!currentFullscreenElement()) return;
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (!exit) return;
        try {
          const result = exit.call(document);
          if (result && typeof result.catch === 'function') result.catch(() => {});
        } catch {}
      }
      function openImageViewer(src, options = {}) {
        viewerMode = options.mode === 'scene' ? 'scene' : 'character';
        viewerCaptionText = options.caption || '';
        if (viewerMode === 'character') {
          viewerList = viewerCharacterList();
          viewerIndex = viewerList.indexOf(activePlan);
          if (viewerIndex < 0) {
            viewerList = [];
            viewerCaptionText =
              (document.getElementById('characterName').value || '自定义角色') + ' · 当前方案';
          } else {
            const key = viewerList[viewerIndex];
            viewerCaptionText =
              viewerName(key) + ' · ' + (viewerIndex + 1) + ' / ' + viewerList.length;
          }
        } else {
          viewerList = [];
          viewerIndex = -1;
        }
        modalImageEl.src = src;
        updateViewerChrome();
        clearViewerHint();
        document.documentElement.classList.add('viewer-open');
        if (!imageModalEl.open) imageModalEl.showModal();
        requestViewerFullscreen();
      }
      function refreshViewerImage() {
        if (viewerMode !== 'character' || viewerIndex < 0) return;
        const key = viewerList[viewerIndex];
        if (!key) return;
        modalImageEl.src = imagePath(key);
        viewerCaptionText =
          viewerName(key) + ' · ' + (viewerIndex + 1) + ' / ' + viewerList.length;
        updateViewerChrome();
      }
      function switchViewer(step) {
        if (viewerMode !== 'character' || viewerIndex < 0 || viewerList.length < 2) return;
        const next = (viewerIndex + step + viewerList.length) % viewerList.length;
        const key = viewerList[next];
        if (typeof applyPreset === 'function') {
          const result = applyPreset(key);
          if (result === false) return;
        }
        viewerIndex = viewerList.indexOf(key);
        refreshViewerImage();
      }
      let viewerClosing = false;
      function closeImageViewer() {
        if (viewerClosing) return;
        viewerClosing = true;
        exitViewerFullscreen();
        clearViewerHint();
        document.documentElement.classList.remove('viewer-open');
        if (imageModalEl.open) imageModalEl.close();
        viewerClosing = false;
      }
      function handleViewerFullscreenChange() {
        updateFullscreenButton();
        // 退出全屏（按钮、Esc 或系统操作）时直接关闭预览，回到原来的页面。
        if (!currentFullscreenElement() && !viewerClosing && imageModalEl.open) {
          closeImageViewer();
        }
      }
      document.getElementById('prevImage').onclick = () => switchViewer(-1);
      document.getElementById('nextImage').onclick = () => switchViewer(1);
      closeModalButton.onclick = closeImageViewer;
      toggleFullscreenButton.onclick = () => {
        if (currentFullscreenElement()) closeImageViewer();
        else requestViewerFullscreen();
      };
      document.addEventListener('fullscreenchange', handleViewerFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleViewerFullscreenChange);
      imageModalEl.addEventListener('close', () => {
        exitViewerFullscreen();
        clearViewerHint();
        document.documentElement.classList.remove('viewer-open');
      });
      imageModalEl.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          switchViewer(-1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          switchViewer(1);
        }
      });
      updateFullscreenButton();
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

