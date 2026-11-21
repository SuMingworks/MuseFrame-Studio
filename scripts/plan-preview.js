      const characterMetadata = (field) => Object.fromEntries(
        Object.entries(characterLibrary)
          .filter(([, record]) => record[field] !== undefined)
          .map(([id, record]) => [id, record[field]]),
      );
      const legacyImageFiles = characterMetadata('legacyImage');
      const descriptions = characterMetadata('description');
      const palettes = characterMetadata('palette');
      const order = characterCardOrder;
      let previewPlan;
      let previewIndex = 0;
      function characterImagePaths(key) {
        const record = characterLibrary[key];
        const files = Array.isArray(record?.images)
          ? record.images.filter((file) => typeof file === 'string' && file.trim())
          : [];
        if (!files.length && record?.image) files.push(record.image);
        return files.map((file) => 'images/characters/' + file);
      }
      function imagePath(k) {
        return characterImagePaths(k)[0] || '';
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
        if (previewPlan !== k) {
          previewPlan = k;
          previewIndex = 0;
        }
        renderCharacterPreview();
        document.getElementById('imageHint').textContent = changed.length
          ? '已修改参数，预览图仍对应原始方案'
          : '图片来自本地 images 文件夹';
      }
      function renderCharacterPreview() {
        const paths = characterImagePaths(previewPlan);
        const path = paths[previewIndex];
        const gallery = document.getElementById('previewGallery');
        gallery.hidden = paths.length < 2;
        if (!gallery.hidden) {
          document.getElementById('previewImageCount').textContent =
            (previewIndex + 1) + ' / ' + paths.length;
        }
        const img = document.getElementById('mainImage');
        const empty = document.getElementById('imageEmpty');
        if (path) {
          if (img.getAttribute('src') === path) return;
          img.style.display = 'block';
          img.onerror = () => {
            img.style.display = 'none';
            empty.hidden = false;
            empty.textContent =
              '未找到预览图片：' + path + '。请确认 images 文件夹及文件名。';
          };
          img.onload = () => {
            img.style.display = 'block';
            empty.hidden = true;
          };
          img.src = path;
          empty.hidden = true;
        } else {
          img.removeAttribute('src');
          img.style.display = 'none';
          empty.hidden = false;
          empty.textContent = '此方案尚未配置本地预览图';
        }
      }
      function switchCharacterPreview(step) {
        const count = characterImagePaths(previewPlan).length;
        if (count < 2) return;
        previewIndex = (previewIndex + step + count) % count;
        renderCharacterPreview();
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
      document.getElementById('prevPreviewImage').onclick = () => switchCharacterPreview(-1);
      document.getElementById('nextPreviewImage').onclick = () => switchCharacterPreview(1);
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
      function viewerCharacterImages() {
        return order.filter((key) => builtInPlans[key]).flatMap((key) =>
          characterImagePaths(key).map((path, imageIndex) => ({ key, path, imageIndex })),
        );
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
        viewerList = [];
        viewerIndex = -1;
        modalImageEl.src = src;
        if (viewerMode === 'character') {
          viewerList = viewerCharacterImages();
          viewerIndex = viewerList.findIndex(
            ({ key, imageIndex }) => key === activePlan && imageIndex === previewIndex,
          );
          if (viewerIndex < 0) {
            viewerCaptionText =
              (document.getElementById('characterName').value || '自定义角色') + ' · 当前方案';
          } else {
            refreshViewerImage();
          }
        }
        updateViewerChrome();
        clearViewerHint();
        document.documentElement.classList.add('viewer-open');
        if (!imageModalEl.open) imageModalEl.showModal();
        requestViewerFullscreen();
      }
      function refreshViewerImage() {
        const { key, path } = viewerList[viewerIndex];
        modalImageEl.src = path;
        viewerCaptionText =
          viewerName(key) + ' · ' + (viewerIndex + 1) + ' / ' + viewerList.length;
        updateViewerChrome();
      }
      function switchViewer(step) {
        const count = viewerList.length;
        if (viewerMode !== 'character' || viewerIndex < 0 || count < 2) return;
        const next = (viewerIndex + step + count) % count;
        const { key } = viewerList[next];
        if (key !== activePlan && applyPreset(key) === false) return;
        viewerIndex = next;
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

