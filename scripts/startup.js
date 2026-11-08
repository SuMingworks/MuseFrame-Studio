      // Startup: prompt to recover an autosaved draft rather than silently overwriting a built-in scheme.
      (function () {
        draftName.value = currentName();
        let d = null;
        try {
          d = JSON.parse(localStorage.getItem(draftKey) || 'null');
        } catch {}
        if (d && d.values && typeof d.values === 'object') {
          if (confirm('检测到上次未保存的角色草稿「' + (d.name || '未命名') + '」。是否恢复？')) {
            restoringDraft = true;
            if (
              d.activePlan &&
              (builtInPlans[d.activePlan] ||
                (d.activePlan.startsWith('custom:') && customPresets[d.activePlan.slice(7)]))
            ) {
              originalApplyV11(d.activePlan);
              activePlan = d.activePlan;
              renderPresetSelect(activePlan);
            }
            customFields = readCustomFields(d);
            for (const f of fields)
              if (typeof d.values[f[0]] === 'string') values[f[0]] = d.values[f[0]];
            setName(d.name || '未命名角色');
            render();
            setOutputSettings(d.outputSettings || outputDefaults);
            setSceneSettings(d.sceneSettings || sceneDefaults, false);
            dirty = true;
            restoringDraft = false;
            updateVisual();
            refreshSaveState();
          } else clearDraft();
        }
        refreshSaveState();
      })();

      renderPlanList();
      updateVisual();
      document.getElementById('characterName').addEventListener('input', updateVisual);
      document
        .getElementById('restorePlan')
        .addEventListener('click', () => setTimeout(updateVisual, 0));
      document
        .getElementById('preset')
        .addEventListener('change', () => setTimeout(updateVisual, 0));

