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
        full: [
          '单人全身立绘构图',
          '画面仅出现一位完整人物，从头顶到鞋底完整入镜，突出服装整体剪裁和人物气质',
          '正面或轻微三分之四视角，保持单人单画面',
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
        details: [
          '服装细节展示构图',
          '以角色全身展示为主，辅以服装接缝、领口、袖口、鞋履、发饰和面料纹理的局部放大细节',
          '各局部细节必须对应同一套角色服装和同一组饰品，不凭空增加新的配件',
        ],
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
        return n;
      }
      function refreshOutputControls() {
        for (const [id, key] of [
          ['outputMode', 'mode'],
          ['outputRatio', 'ratio'],
          ['outputResolution', 'resolution'],
          ['outputQuality', 'quality'],
        ])
          document.getElementById(id).value = outputSettings[key];
        const [w, h] = outputDims[outputSettings.ratio][outputSettings.resolution];
        document.getElementById('outputSummary').textContent =
          `当前：${document.getElementById('outputMode').selectedOptions[0].textContent} · ${outputSettings.ratio} · ${outputSettings.resolution}（目标 ${w} × ${h} 像素）· ${outputSettings.quality}画质。实际像素由外部图像生成工具决定。`;
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
        return { mode, title, framing, ratio, quality: qualityDescriptions[quality] };
      };
      const applyBeforeOutput = applyPreset;
      applyPreset = function (k) {
        if (!applyBeforeOutput(k) || activePlan !== k) return false;
        const saved = k.startsWith('custom:') ? customPresets[k.slice(7)] : null;
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

