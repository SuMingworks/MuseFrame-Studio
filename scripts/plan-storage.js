      // V1.1: 非破坏性个人方案保存 / 自动草稿 / 全量备份
      const draftKey = 'museframe_draft_v11';
      const draftName = document.getElementById('quickName');
      const saveState = document.getElementById('saveState');
      const updateButton = document.getElementById('updatePreset');
      let dirty = false;
      let restoringDraft = false;
      function currentName() {
        return document.getElementById('characterName').value.trim() || '未命名角色';
      }
      function refreshSaveState() {
        const custom = activePlan.startsWith('custom:');
        updateButton.disabled = !custom;
        saveState.textContent = dirty
          ? '● 有未保存修改 · 草稿已自动暂存'
          : custom
            ? '✓ 我的方案 · 已保存'
            : '✓ 内置模板 · 原始方案受保护';
      }
      function storeDraft() {
        if (restoringDraft) return;
        dirty = true;
        const d = {
          version: 1,
          activePlan,
          name: currentName(),
          values: { ...values },
          customFields: [...customFields],
          outputSettings: { ...outputSettings },
          sceneSettings: copySceneSettings(),
          savedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(draftKey, JSON.stringify(d));
          saveState.textContent = '● 有未保存修改 · 草稿已自动暂存';
        } catch {
          saveState.textContent = '⚠ 自动暂存不可用，请导出 JSON 备份';
        }
        refreshSaveState();
      }
      function clearDraft() {
        dirty = false;
        try {
          localStorage.removeItem(draftKey);
        } catch {}
        refreshSaveState();
      }
      function setName(n) {
        document.getElementById('characterName').value = n;
        draftName.value = n;
        updateVisual();
        generate();
      }
      draftName.addEventListener('input', () => {
        document.getElementById('characterName').value = draftName.value;
        updateVisual();
        generate();
        storeDraft();
      });
      document.getElementById('characterName').addEventListener('input', () => {
        draftName.value = document.getElementById('characterName').value;
        updateVisual();
        storeDraft();
      });
      // Wrap the existing render() so newly rendered dropdowns and free-text editors participate in draft saving.
      const originalRender = render;
      render = function () {
        originalRender();
        document.querySelectorAll('#groups select,#groups textarea').forEach((el) => {
          el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
            storeDraft();
            updateVisual();
          });
        });
      };
      // Restore full current state on every scheme change, but do not silently discard unsaved work.
      const originalApplyV11 = applyPreset;
      applyPreset = function (k) {
        if (
          dirty &&
          !restoringDraft &&
          !confirm('当前角色有未保存修改。切换方案将舍弃当前草稿，是否继续？')
        ) {
          renderPresetSelect(activePlan);
          return false;
        }
        originalApplyV11(k);
        draftName.value = currentName();
        clearDraft();
        return true;
      };
      document.getElementById('restorePlan').onclick = () => {
        if (activePlan && confirm('恢复已保存的方案参数和名称？当前修改将丢失。')) {
          dirty = false;
          applyPreset(activePlan);
        }
      };
      document.getElementById('reset').onclick = () => {
        if (applyPreset('mist')) renderPresetSelect('mist');
      };
      // Replace legacy "save" action with explicit save-as. Existing localStorage key stays unchanged.
      document.getElementById('savePreset').onclick = () => {
        const name = currentName();
        if (!name || name === '未命名角色') {
          alert('请先填写角色名称');
          return;
        }
        const id = 'plan_' + Date.now();
        customPresets[id] = {
          name,
          values: { ...values },
          customFields: [...customFields],
          outputSettings: { ...outputSettings },
          sceneSettings: copySceneSettings(),
          image: activePlan.startsWith('custom:')
            ? customPresets[activePlan.slice(7)]?.image || ''
            : imageFiles[activePlan] || '',
        };
        try {
          localStorage.setItem(customPresetKey, JSON.stringify(customPresets));
        } catch {
          delete customPresets[id];
          alert('浏览器保存失败，请使用 JSON 备份');
          return;
        }
        activePlan = 'custom:' + id;
        baseline = { ...values };
        renderPresetSelect(activePlan);
        dirty = false;
        clearDraft();
        renderPlanList();
        updateVisual();
        document.getElementById('presetInfo').textContent =
          '已另存为「' + name + '」，原始内置方案保持不变。';
      };
      updateButton.onclick = () => {
        if (!activePlan.startsWith('custom:')) {
          alert('内置方案只读，请先另存为新方案');
          return;
        }
        const id = activePlan.slice(7);
        if (!customPresets[id]) {
          alert('该个人方案已不存在');
          return;
        }
        const old = customPresets[id];
        const name = currentName();
        customPresets[id] = {
          ...old,
          name,
          values: { ...values },
          customFields: [...customFields],
          outputSettings: { ...outputSettings },
          sceneSettings: copySceneSettings(),
        };
        try {
          localStorage.setItem(customPresetKey, JSON.stringify(customPresets));
        } catch {
          customPresets[id] = old;
          alert('保存失败，请导出 JSON');
          return;
        }
        baseline = { ...values };
        renderPresetSelect(activePlan);
        clearDraft();
        renderPlanList();
        updateVisual();
        document.getElementById('presetInfo').textContent = '已保存「' + name + '」的修改。';
      };
      // Custom scheme preview retains its source image when saved from a built-in scheme.
      const originalImagePath = imagePath;
      imagePath = function (k) {
        if (k.startsWith('custom:')) {
          const file = customPresets[k.slice(7)]?.image;
          if (!file) return '';
          const legacyKey = Object.keys(legacyImageFiles).find((key) => legacyImageFiles[key] === file);
          if (legacyKey) return originalImagePath(legacyKey);
          const directory = Object.values(imageFiles).includes(file) ? 'images/characters/' : 'images/';
          return directory + file;
        }
        return originalImagePath(k);
      };
      const originalUpdateVisual = updateVisual;
      updateVisual = function () {
        originalUpdateVisual();
        refreshSaveState();
      };
      // Complete backup: personal plans, custom option library, and optionally the current draft.
      document.getElementById('exportAll').onclick = () =>
        download(
          'MuseFrame-Studio-完整备份.json',
          JSON.stringify(
            {
              format: 'MuseFrameStudioBackup',
              version: 1,
              exportedAt: new Date().toISOString(),
              customPresets,
              extras,
              scenePresets: readScenePresets(),
              draft: (() => {
                try {
                  return JSON.parse(localStorage.getItem(draftKey) || 'null');
                } catch {
                  return null;
                }
              })(),
            },
            null,
            2,
          ),
          'application/json;charset=utf-8',
        );
      document.getElementById('importAll').onclick = () =>
        document.getElementById('allBackupFile').click();
      document.getElementById('allBackupFile').onchange = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        try {
          const b = JSON.parse(await f.text());
          if (
            b.format !== 'MuseFrameStudioBackup' ||
            !b.customPresets ||
            !b.extras ||
            typeof b.customPresets !== 'object' ||
            typeof b.extras !== 'object' ||
            Array.isArray(b.customPresets) ||
            Array.isArray(b.extras)
          )
            throw Error('备份格式不正确');
          if (!confirm('恢复备份会覆盖当前浏览器中的个人方案和自定义词库，是否继续？')) return;
          localStorage.setItem(customPresetKey, JSON.stringify(b.customPresets));
          localStorage.setItem(key, JSON.stringify(b.extras));
          if (b.scenePresets && typeof b.scenePresets === 'object')
            localStorage.setItem(scenePresetKey, JSON.stringify(b.scenePresets));
          if (b.draft) localStorage.setItem(draftKey, JSON.stringify(b.draft));
          else localStorage.removeItem(draftKey);
          alert('备份已恢复，页面即将重新加载');
          location.reload();
        } catch (err) {
          alert('无法恢复备份：' + err.message);
        } finally {
          e.target.value = '';
        }
      };
