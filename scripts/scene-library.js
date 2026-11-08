      // V1.6 — Independent curated scene prompt library.
      const sceneLibraryKey = 'museframe_scene_prompt_library_v16';
      const sceneLibraryBuilt = {
        中性摄影棚:
          '纯净中性摄影棚，平整无缝背景与柔和大面积漫射光，地面存在轻微真实接触阴影，背景没有干扰主体的装饰。空间比例准确，适合清楚展示人物轮廓、材质、鞋袜及服装结构。',
        江南园林:
          '典雅江南私家园林，白墙黛瓦、月洞门、曲折回廊、太湖石、青苔石阶与平静池水形成层次分明的空间。前景保留人物活动区，中景廊柱与石桥建立尺度关系，远景亭台和树影形成自然纵深。建筑透视严谨，地面与人物有可信接触阴影。',
        中式宫苑:
          '庄重精致的中式宫苑，朱红宫墙、金色琉璃瓦、汉白玉台阶、雕花门窗和对称建筑轴线。廊柱与殿门构成引导线，近处石阶、中景宫门、远景屋脊逐层展开，木材与石材纹理清晰，人物和建筑尺度协调。',
        竹林幽径:
          '幽静青竹林与曲折石板小径，竹叶层层筛落自然光，浅雾穿行于竹竿之间，远处隐约可见小亭与山石。保留人物站立与行走的完整空间，竹影自然落在地面及衣料上，环境安静清透。',
        古镇灯市:
          '传统临水古镇的夜间灯市，木楼、青石街巷、石桥、檐下暖色灯笼和河面倒影交织出生活气息。前景摊位与栏杆适度点缀，中景人物活动区域清晰，远景灯火逐渐虚化；灯笼暖光与环境夜色共同作用于人物。',
        水墨山河:
          '富有东方水墨审美的山河意境，层叠远山、江水、苍松与轻雾通过留白建立远近关系。空间具有可信地形与透视，同时保留水墨般柔和的明暗节奏；人物清晰立于实景前景，不漂浮于画面之上。',
        仙侠云境:
          '宏阔仙侠云境，云海之间的悬空楼阁、灵山峰峦、飞瀑与古典栈道相互连接。柔和体积光穿透云层，远景山体逐层淡化，脚下平台与栏杆具备可信结构和尺度，人物与场景共享光源和空间透视。',
        云海仙宫:
          '高空云海上的中式仙宫，层层玉石台阶、雕花栏杆、飞檐楼阁和浮动薄云构成庄严而空灵的空间。近景平台可供人物真实站立，云海与远方宫殿呈现清晰纵深，环境光与金属、织物反射一致。',
        欧式花园:
          '精致欧式古典花园，玫瑰、绣球花、白色石拱廊、修剪绿篱与小型喷泉构成对称又自然的景观。前景石径、中景人物与花圃、远景庭院建筑分层明确，花木不遮挡主体，阳光与石材反射自然。',
        古堡庭院:
          '古典石砌城堡庭院，高耸拱门、雕刻立柱、石板地面、攀缘藤蔓与古旧窗框。建筑尺度宏伟而真实，前景台阶和栏杆提供人物互动位置，中景石墙与远景塔楼形成电影感纵深。',
        月光喷泉:
          '静谧月夜中的古典喷泉广场，浅色石雕、水面涟漪、拱廊与低矮绿篱沐浴冷色月光。水面反射与少量暖色庭灯构成冷暖对比，人物轮廓获得自然边缘光，脚下石地接触阴影可信。',
        现代校园:
          '明亮现代校园，教学楼玻璃立面、整洁步道、树荫、长椅和开阔草坪。建筑线条简洁，近景道路与中景人物位置明确，远景教学楼适度虚化；日光照明自然，画面有青春生活感。',
        城市天台:
          '现代都市高楼天台，金属护栏、混凝土地面、通风设备与远处层叠城市天际线。人物与护栏的比例可信，地平线和相机透视一致，天空光与城市反射共同塑造清晰主体轮廓。',
        霓虹街道:
          '未来感都市霓虹街道，蓝紫与暖色招牌光映照雨后湿润路面，玻璃幕墙和街道灯带形成纵深透视。前景反射与中景人物清楚分离，远景灯光形成柔和散景；霓虹环境色影响人物受光而不改变服装固有色。',
        海滨栈道:
          '开阔海滨栈道，木质步道、海边栏杆、细沙、潮汐浪花和遥远海平线。海风轻拂发丝与衣角，天空与水面提供柔和反射，人物脚下木板具有真实接触阴影，画面通透自然。',
        森林溪谷:
          '清澈森林溪谷，苔藓岩石、潺潺溪水、蕨类植物与高大林木围合安静空间。斑驳天光透过树冠落在人物和石面，前景溪石、中景人物、远景林木层次清楚，环境湿润感适度。',
        高山草甸:
          '开阔高山草甸，柔软草地、零星野花、起伏山坡与远方山脊。天空光干净，微风带动草叶和衣摆，人物站立位置清晰，地面阴影与自然地形一致，画面具有开阔呼吸感。',
        星际舰桥:
          '精密科幻星际舰桥，弧形控制台、金属地板、全景观察窗和远方星空。屏幕与舱内灯带提供多层次环境光，人物与控制台、地板尺度准确，材质反射符合金属与玻璃特性。',
        未来都市:
          '未来都市建筑群，流线型高楼、悬浮交通设施、层叠步道与可控光带，兼具宏观城市纵深和精细结构。前景平台提供真实人物立足点，中远景透视一致，环境光反射自然，避免背景喧宾夺主。',
      };
      function sceneLibraryRead() {
        try {
          const v = JSON.parse(localStorage.getItem(sceneLibraryKey) || '{}');
          return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
        } catch {
          return {};
        }
      }
      function sceneLibraryWrite(v) {
        localStorage.setItem(sceneLibraryKey, JSON.stringify(v));
      }
      let sceneLibrarySource = 'built',
        sceneLibraryId = '',
        sceneLibraryText = '',
        sceneLibraryEnabled = true;
      const slSource = document.getElementById('sceneLibrarySource'),
        slSelect = document.getElementById('sceneLibrarySelect'),
        slText = document.getElementById('sceneLibraryText'),
        slUse = document.getElementById('sceneLibraryUse'),
        slHint = document.getElementById('sceneLibraryHint');
      function sceneLibraryItems() {
        return sceneLibrarySource === 'built' ? sceneLibraryBuilt : sceneLibraryRead();
      }
      function sceneLibraryRefresh(pick) {
        const items = sceneLibraryItems(),
          names = Object.keys(items);
        slSelect.replaceChildren();
        if (!names.length) {
          slSelect.add(new Option('暂无个人场景模板', ''));
          sceneLibraryId = '';
          sceneLibraryText = '';
          slText.value = '';
          return;
        }
        for (const name of names) slSelect.add(new Option(name, name));
        sceneLibraryId = names.includes(pick) ? pick : names[0];
        slSelect.value = sceneLibraryId;
        sceneLibraryText = String(items[sceneLibraryId] || '');
        slText.value = sceneLibraryText;
        slHint.textContent =
          sceneLibrarySource === 'built'
            ? '内置模板只读。可编辑文本并另存为个人场景；切换场景后可自动匹配对应模板。'
            : '个人场景模板可编辑、更新、删除，并能跨角色复用。';
      }
      function sceneLibraryAutoMatch() {
        if (sceneLibrarySource !== 'built' ||
            sceneLibraryText !== sceneLibraryBuilt[sceneLibraryId]) return;
        const name = sceneSettings.location;
        if (Object.hasOwn(sceneLibraryBuilt, name) && name !== sceneLibraryId)
          sceneLibraryRefresh(name);
      }
      slSource.addEventListener('change', () => {
        sceneLibrarySource = slSource.value;
        sceneLibraryRefresh(sceneSettings.location);
        generate();
        storeDraft();
      });
      slSelect.addEventListener('change', () => {
        sceneLibraryRefresh(slSelect.value);
        generate();
        storeDraft();
      });
      slText.addEventListener('input', () => {
        sceneLibraryText = slText.value;
        generate();
        storeDraft();
      });
      slUse.addEventListener('change', () => {
        sceneLibraryEnabled = slUse.checked;
        generate();
        storeDraft();
      });
      document.getElementById('sceneLibraryCopy').onclick = () =>
        navigator.clipboard
          ?.writeText(slText.value)
          .then(() => alert('已复制场景提示词'))
          .catch(() => {
            slText.select();
            document.execCommand('copy');
          });
      document.getElementById('sceneLibraryReset').onclick = () => {
        if (sceneLibrarySource !== 'built') {
          alert('此按钮仅用于恢复内置模板原文');
          return;
        }
        sceneLibraryText = sceneLibraryBuilt[sceneLibraryId] || '';
        slText.value = sceneLibraryText;
        generate();
        storeDraft();
      };
      document.getElementById('sceneLibrarySave').onclick = () => {
        const name = prompt('为个人场景提示词命名：', sceneLibraryId + ' · 自定义');
        if (!name || !name.trim()) return;
        const key = name.trim();
        const items = sceneLibraryRead();
        if (Object.hasOwn(items, key) && !confirm('同名个人场景已存在，是否覆盖？')) return;
        items[key] = slText.value;
        try {
          sceneLibraryWrite(items);
          sceneLibrarySource = 'mine';
          slSource.value = 'mine';
          sceneLibraryRefresh(key);
          generate();
          storeDraft();
        } catch {
          alert('浏览器存储失败，请导出备份');
        }
      };
      document.getElementById('sceneLibraryUpdate').onclick = () => {
        if (sceneLibrarySource !== 'mine' || !sceneLibraryId) {
          alert('请先选择一个个人场景模板');
          return;
        }
        const items = sceneLibraryRead();
        items[sceneLibraryId] = slText.value;
        try {
          sceneLibraryWrite(items);
          sceneLibraryRefresh(sceneLibraryId);
          generate();
          storeDraft();
          alert('个人场景提示词已保存');
        } catch {
          alert('保存失败');
        }
      };
      document.getElementById('sceneLibraryDelete').onclick = () => {
        if (sceneLibrarySource !== 'mine' || !sceneLibraryId) {
          alert('内置模板不能删除');
          return;
        }
        if (!confirm('删除个人场景「' + sceneLibraryId + '」？')) return;
        const items = sceneLibraryRead();
        delete items[sceneLibraryId];
        sceneLibraryWrite(items);
        sceneLibraryRefresh();
        generate();
        storeDraft();
      };
      // Synchronize template when selecting another built-in scene; preserve manual edits until scene changes.
      const sceneChangedBeforeLibrary = sceneChanged;
      sceneChanged = function (key) {
        if (key === 'category' || key === 'location') sceneLibraryAutoMatch();
        sceneChangedBeforeLibrary();
      };
      // Personal plans and draft store the selected template and its edited text.
      function sceneLibraryState() {
        return {
          source: sceneLibrarySource,
          id: sceneLibraryId,
          text: sceneLibraryText,
          enabled: sceneLibraryEnabled,
        };
      }
      function sceneLibraryRestore(v) {
        if (v && typeof v === 'object') {
          sceneLibrarySource = v.source === 'mine' ? 'mine' : 'built';
          slSource.value = sceneLibrarySource;
          sceneLibraryRefresh(v.id);
          if (typeof v.text === 'string') {
            sceneLibraryText = v.text;
            slText.value = v.text;
          }
          sceneLibraryEnabled = v.enabled !== false;
          slUse.checked = sceneLibraryEnabled;
        } else {
          sceneLibrarySource = 'built';
          slSource.value = 'built';
          sceneLibraryRefresh(sceneSettings.location);
          sceneLibraryEnabled = true;
          slUse.checked = true;
        }
        generate();
      }
      // Attach to existing sceneSettings so all established save, draft, JSON import/export flows retain this data.
      const copySceneSettingsBeforeLibrary = copySceneSettings;
      copySceneSettings = function () {
        return { ...copySceneSettingsBeforeLibrary(), promptLibrary: sceneLibraryState() };
      };
      const setSceneSettingsBeforeLibrary = setSceneSettings;
      setSceneSettings = function (o, edited) {
        setSceneSettingsBeforeLibrary(o, edited);
        sceneLibraryRestore(o?.promptLibrary);
      };
      // Complete backup includes independent personal scene library; old backups remain importable.
      document.getElementById('exportAll').onclick = () =>
        download(
          'MuseFrame-Studio-完整备份.json',
          JSON.stringify(
            {
              format: 'MuseFrameStudioBackup',
              version: 2,
              exportedAt: new Date().toISOString(),
              customPresets,
              extras,
              scenePresets: readScenePresets(),
              scenePromptLibrary: sceneLibraryRead(),
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
      const importAllLibrary = document.getElementById('allBackupFile').onchange;
      document.getElementById('allBackupFile').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const backup = JSON.parse(await file.text());
          if (backup.format !== 'MuseFrameStudioBackup' || !backup.customPresets || !backup.extras)
            throw Error('备份格式不正确');
          if (!confirm('恢复备份将覆盖当前个人方案和词库，是否继续？')) return;
          localStorage.setItem(customPresetKey, JSON.stringify(backup.customPresets));
          localStorage.setItem(key, JSON.stringify(backup.extras));
          if (backup.scenePresets && typeof backup.scenePresets === 'object')
            localStorage.setItem(scenePresetKey, JSON.stringify(backup.scenePresets));
          if (backup.scenePromptLibrary && typeof backup.scenePromptLibrary === 'object')
            sceneLibraryWrite(backup.scenePromptLibrary);
          if (backup.draft) localStorage.setItem(draftKey, JSON.stringify(backup.draft));
          else localStorage.removeItem(draftKey);
          alert('备份已恢复，页面即将重新加载');
          location.reload();
        } catch (err) {
          alert('无法恢复备份：' + err.message);
        } finally {
          e.target.value = '';
        }
      };
      sceneLibraryRefresh(sceneSettings.location);
      generate();

