      /* V2.1 layout-only orchestration: preserve V1.9 data, IDs, and handlers. */
      (function () {
        const main = document.querySelector('main.main');
        const hero = main.querySelector('.hero'),
          scene = main.querySelector('.scene-panel'),
          output = main.querySelector('.output-panel'),
          work = main.querySelector('#workspaceTabs');
        const nav = document.createElement('nav');
        nav.className = 'workflow-nav';
        nav.setAttribute('aria-label', '五阶段创作导航');
        const definitions = [
          ['人物设计', '角色资产', '先完成角色识别、服装与人体参数'],
          ['画面设计', '出图模式', '决定四视图、立绘或场景海报，以及画幅规格'],
          ['场景设计', '环境参数', '选择地点、天气、灯光并管理场景方案'],
          ['场景融合', '融合策略', '决定背景点缀、自然融合或沉浸式环境'],
          ['生成输出', '提示词', '预览提示词、检查一致性并复制或导出'],
        ];
        const stages = definitions.map((d, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.innerHTML = `0${i + 1} ${d[0]}<span>${d[1]}</span>`;
          nav.appendChild(b);
          const el = document.createElement('section');
          el.className = 'workflow-stage';
          el.dataset.stage = String(i);
          el.innerHTML = `<h2 class="workflow-heading">0${i + 1} · ${d[0]}</h2><p class="workflow-description">${d[2]}</p>`;
          b.onclick = () => openStage(i);
          return el;
        });
        main.insertBefore(nav, scene);
        for (const st of stages) main.insertBefore(st, scene);
        // Keep the character preview permanently visible above the five-stage navigation.
        const params = work.querySelector('[data-pane="params"]');
        const paramsCard = document.createElement('section');
        paramsCard.className = 'panel';
        paramsCard.style.padding = '16px';
        paramsCard.innerHTML =
          '<h3 style="color:#674b95;margin:0 0 14px">✦ 人物详细参数（25项）</h3>';
        paramsCard.append(params);
        params.hidden = false;
        stages[0].append(paramsCard);
        stages[1].append(output);
        stages[2].append(scene);
        const scenePane = document.getElementById('scenePane');
        const fusionPane = document.getElementById('fusionPane');
        const fusionCard = document.createElement('section');
        fusionCard.className = 'panel';
        fusionCard.style.padding = '16px';
        fusionCard.innerHTML =
          '<h3 style="color:#674b95;margin:0 0 12px">✦ 人物与场景融合（6项）</h3><div class="workflow-tip">先在「场景设计」中启用场景并选择地点，再在这里设置融合方式。出图模式决定画面结构；场景应用方式不会自动改变四视图。</div>';
        fusionCard.append(fusionPane);
        fusionPane.hidden = false;
        stages[3].append(fusionCard);
        const appLabel =
          document.querySelector('#sceneApplication')?.closest('label') ||
          Array.from(scene.querySelectorAll('label')).find((e) =>
            e.textContent.includes('场景应用方式'),
          );
        if (appLabel) {
          const appBox = document.createElement('div');
          appBox.className = 'workflow-tip';
          appBox.innerHTML =
            '<strong>场景应用方式</strong> · 仅控制环境参与画面的程度，不改变出图模式。';
          appLabel.parentNode.insertBefore(appBox, appLabel);
          appBox.append(appLabel);
          stages[3].insertBefore(appBox, fusionCard);
        }
        stages[4].append(work);
        const tabs = work.querySelector('.tabs');
        if (tabs) {
          tabs.querySelector('[data-tab="params"]')?.remove();
        }
        const bottom = document.createElement('div');
        bottom.className = 'workflow-bottom';
        bottom.innerHTML =
          '<span class="stage-indicator" id="workflowIndicator">01 / 05 · 人物设计</span><button type="button" id="workflowPrev">← 上一步</button><button type="button" id="workflowNext">下一步 →</button>';
        const actions = work.querySelector('.actions');
        const extras = document.createElement('div');
        extras.className = 'extra-actions';
        ['copy', 'txt', 'save', 'savePreset', 'updatePreset', 'restorePlan'].forEach((id) => {
          const b = document.getElementById(id);
          if (b) extras.append(b);
        });
        bottom.append(extras);
        const gen = document.getElementById('generateMain');
        bottom.append(gen);
        actions.remove();
        document.body.append(bottom);
        const scenePreview = document.getElementById('scenePreviewHero');
        const sceneImage = document.getElementById('scenePreviewImage');
        const sceneEmpty = document.getElementById('scenePreviewEmpty');
        const openScenePreview = document.getElementById('openScenePreview');
        function sceneImagePath(location) {
          return Object.hasOwn(sceneLocationCategory, location)
            ? 'images/scenes/' + encodeURIComponent(location) + '.png'
            : '';
        }
        const sceneCards = new Map();
        const scenePlanList = document.getElementById('scenePlanList');
        for (const [category, locations] of Object.entries(sceneLocationGroups)) {
          for (const location of locations) {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'plan-item';
            const path = sceneImagePath(location);
            const thumbnail = document.createElement(path ? 'img' : 'span');
            if (path) {
              thumbnail.src = path;
              thumbnail.alt = '';
              thumbnail.loading = 'lazy';
            } else {
              thumbnail.className = 'custom-thumbnail';
              thumbnail.textContent = '✦';
              thumbnail.setAttribute('aria-hidden', 'true');
            }
            const label = document.createElement('span');
            const name = document.createElement('strong');
            name.textContent = location;
            label.append(name);
            card.append(thumbnail, label);
            card.onclick = () => {
              if (sceneSettings.location === location) return;
              sceneSettings.category = category;
              sceneSettings.location = location;
              syncSceneControls();
              sceneChanged('location');
            };
            sceneCards.set(location, card);
            scenePlanList.append(card);
          }
        }
        function setSceneImageVisible(visible) {
          sceneImage.hidden = !visible;
          openScenePreview.hidden = !visible;
          sceneEmpty.hidden = visible;
        }
        sceneImage.onload = () => setSceneImageVisible(true);
        sceneImage.onerror = () => {
          sceneEmpty.textContent = '场景预览图加载失败';
          setSceneImageVisible(false);
        };
        openScenePreview.onclick = () => {
          document.getElementById('modalImg').src = sceneImage.src;
          document.getElementById('imageModal').showModal();
        };
        function updateScenePreview() {
          const { location, category } = sceneSettings;
          document.getElementById('scenePreviewTitle').textContent = location;
          document.getElementById('scenePreviewCategory').textContent = category;
          for (const [name, card] of sceneCards) {
            card.classList.toggle('selected', name === location);
            card.setAttribute('aria-pressed', String(name === location));
          }
          const path = sceneImagePath(location);
          if ((sceneImage.getAttribute('src') || '') === path) return;
          sceneEmpty.textContent = path ? '正在加载场景预览图…' : '此地点尚未配置预览图';
          setSceneImageVisible(false);
          sceneImage.alt = location + '场景预览';
          if (path) sceneImage.src = path;
          else sceneImage.removeAttribute('src');
        }
        const originalRefreshSceneSummary = refreshSceneSummary;
        refreshSceneSummary = function () {
          originalRefreshSceneSummary();
          if (!scenePreview.hidden) updateScenePreview();
        };
        let active = 0;
        function openStage(i) {
          active = Math.max(0, Math.min(4, i));
          hero.hidden = active === 2;
          scenePreview.hidden = active !== 2;
          if (active === 2) updateScenePreview();
          stages.forEach((el, n) => el.classList.toggle('active', n === active));
          nav.querySelectorAll('button').forEach((b, n) => {
            b.classList.toggle('active', n === active);
            b.setAttribute('aria-current', n === active ? 'step' : 'false');
          });
          document.getElementById('workflowIndicator').textContent =
            `0${active + 1} / 05 · ${definitions[active][0]}`;
          document.getElementById('workflowPrev').disabled = active === 0;
          document.getElementById('workflowNext').disabled = active === 4;
          if (active === 4) {
            showTab('prompt');
          } else if (active === 0) {
            params.hidden = false;
          }
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        document.getElementById('workflowPrev').onclick = () => openStage(active - 1);
        document.getElementById('workflowNext').onclick = () => openStage(active + 1);
        gen.onclick = () => {
          generate();
          openStage(4);
          showTab('prompt');
        };
        const oldSceneTabs = scene.querySelector('.scene-tabs');
        if (oldSceneTabs) oldSceneTabs.remove();
        scenePane.hidden = false;
        fusionPane.hidden = false;
        const oldOutputChange = document.getElementById('outputMode');
        oldOutputChange.addEventListener('change', () => {
          const mode = oldOutputChange.value;
          const hint = document.getElementById('workflowModeHint');
          if (hint)
            hint.textContent =
              mode === 'four'
                ? '四视图始终输出角色多视角设定板；即使使用完整场景，也不会变成单人海报。'
                : mode === 'poster'
                  ? '场景海报输出单人场景构图；建议启用场景并选择沉浸式环境。'
                  : '出图模式决定人物的构图形式，场景应用方式只决定背景表现。';
        });
        const hint = document.createElement('p');
        hint.className = 'workflow-tip';
        hint.id = 'workflowModeHint';
        hint.textContent =
          '四视图始终输出角色多视角设定板；如需单人完整场景，请选择「场景氛围海报」。';
        output.append(hint);
        openStage(0);
      })();
