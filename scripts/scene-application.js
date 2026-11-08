      // V1.9 — Mode-aware application of manually enabled scenes.
      (function () {
        const select = document.createElement('select');
        select.id = 'sceneApplication';
        select.innerHTML =
          '<option value="subtle">弱化场景 · 角色优先</option><option value="integrated">自然融合 · 场景与角色统一</option><option value="complete">完整场景 · 环境叙事优先</option>';
        const label = document.createElement('label');
        label.className = 'scene-application-control';
        label.style.cssText =
          'display:block;margin:12px 0;padding:10px;border:1px solid #e6dcf0;border-radius:10px;background:#faf7ff';
        label.append('场景应用方式（手动开启场景后生效）', select);
        select.style.cssText =
          'display:block;width:100%;margin-top:7px;padding:8px;border:1px solid #d8cce8;border-radius:8px;background:white';
        const toggle = document.getElementById('sceneEnabled');
        toggle.closest('label').insertAdjacentElement('afterend', label);
        const defaults = {
          four: 'subtle',
          full: 'integrated',
          face: 'subtle',
          poses: 'subtle',
          poster: 'complete',
          details: 'subtle',
        };
        function current() {
          return ['subtle', 'integrated', 'complete'].includes(sceneSettings.application)
            ? sceneSettings.application
            : defaults[outputSettings.mode];
        }
        function sync() {
          select.value = current();
          label.style.opacity = sceneSettings.enabled ? '1' : '.55';
          select.disabled = !sceneSettings.enabled;
        }
        const oldSet = setSceneSettings;
        setSceneSettings = function (obj, edited) {
          oldSet(obj, edited);
          sceneSettings.application = ['subtle', 'integrated', 'complete'].includes(
            obj?.application,
          )
            ? obj.application
            : defaults[outputSettings.mode];
          sync();
          generate();
        };
        select.addEventListener('change', () => {
          sceneSettings.application = select.value;
          generate();
          storeDraft();
        });
        toggle.addEventListener('change', () => {
          if (sceneSettings.enabled && !sceneSettings.application)
            sceneSettings.application = defaults[outputSettings.mode];
          sync();
          generate();
        });
        document.getElementById('outputMode').addEventListener('change', () => {
          sceneSettings.application = defaults[outputSettings.mode];
          sync();
          generate();
          storeDraft();
        });
        // Keep built-in visual motifs separate from editable lighting and camera settings.
        const motifs = {
          中性摄影棚: '平整无缝背景与干净地面',
          江南园林: '白墙黛瓦、月洞门、回廊与池水',
          中式宫苑: '朱红宫墙、琉璃瓦、石阶与对称轴线',
          竹林幽径: '青竹、曲折石板路与山石',
          古镇灯市: '临水木楼、青石街巷、石桥与檐下灯笼',
          水墨山河: '层叠远山、江水与苍松',
          仙侠云境: '云海、悬空楼阁、峰峦与栈道',
          云海仙宫: '玉石台阶、雕花栏杆与飞檐',
          欧式花园: '花圃、石拱廊、绿篱与喷泉',
          古堡庭院: '石砌拱门、立柱、石板与藤蔓',
          月光喷泉: '石雕喷泉、水面涟漪与古典拱廊',
          现代校园: '教学楼、步道、长椅与草坪',
          城市天台: '混凝土地面、护栏与城市天际线',
          霓虹街道: '玻璃幕墙、霓虹招牌与街道灯带',
          海滨栈道: '木质步道、栏杆、沙滩与海平线',
          森林溪谷: '苔藓岩石、溪水、蕨类与大树',
          高山草甸: '草地、野花、缓坡与山脊',
          星际舰桥: '弧形控制台、金属地板与全景观察窗',
          未来都市: '流线型高楼、悬浮交通与层叠步道',
        };
        const nightLighting = {
          古镇灯市: '灯笼暖光',
          月光喷泉: '月光',
          霓虹街道: '霓虹光',
        };
        function showNotices(notices) {
          document.getElementById('sceneLogicNotice')?.remove();
          if (!notices.length) return;
          const notice = document.createElement('div');
          notice.id = 'sceneLogicNotice';
          notice.style.cssText =
            'margin:8px 0;padding:10px;border-radius:8px;background:#fff7e8;color:#765224;font-size:12px';
          notice.textContent = '场景参数提醒：' + notices.join('；');
          document.getElementById('output').insertAdjacentElement('beforebegin', notice);
        }
        promptScene = (mode) => {
          sync();
          const p = sceneSettings;
          showNotices([]);
          if (!p.enabled) return { enabled: false, blocks: [] };

          const app = current();
          const notices = [];
          const allowsAction = mode === 'full' || mode === 'poster';
          const constrainedBackground = ['four', 'poses', 'details', 'face'].includes(mode);
          const fixedBackground = constrainedBackground || app === 'subtle';
          const uneditedBuiltIn =
            sceneLibrarySource === 'built' &&
            sceneLibraryText === sceneLibraryBuilt[sceneLibraryId];
          const motif = sceneLibraryEnabled && uneditedBuiltIn && Object.hasOwn(motifs, sceneLibraryId)
            ? motifs[sceneLibraryId]
            : '';
          const lightingFallback = motif && Object.hasOwn(nightLighting, sceneLibraryId)
            ? nightLighting[sceneLibraryId]
            : '';
          const time = p.time !== sceneDefaults.time ? p.time : lightingFallback && '夜晚';
          const studio = p.category === '纯净摄影棚';
          const lightMatch = { 月光匹配: '月光', 灯光匹配: lightingFallback || '场景实景光' };
          const fusionLight = p.fusionEnabled && p.light && p.light !== sceneDefaults.light
            ? (Object.hasOwn(lightMatch, p.light) ? lightMatch[p.light] : p.light)
            : '';
          const lighting = p.lighting === sceneDefaults.lighting && !p.explicit?.lighting
            ? fusionLight || (studio ? p.lighting : ((!time || time === '夜晚') && lightingFallback) || '环境漫射光')
            : p.lighting;
          if (fusionLight && fusionLight !== lighting)
            notices.push('场景光照与融合光影同时设置，采用场景光照');
          const environment = [
            [p.category, p.location].filter(Boolean).join(' · '),
            motif,
            fixedBackground
              ? '控制背景对比度与细节密度，保持人物轮廓和展示区域清晰'
              : app === 'integrated'
                ? '人物与环境共享清晰的空间层次'
                : '呈现场景纵深和环境叙事，保持人物身份与服装清晰',
            time && '时间：' + time,
            '光照：' + lighting,
          ];
          const fields = {
            weather: '天气',
            season: '季节',
            temperature: '色温',
            mood: '氛围',
            complexity: '背景复杂度',
            depth: '景深',
            props: '场景道具',
          };
          for (const [key, label] of Object.entries(fields)) {
            const value = p[key];
            if (typeof value !== 'string' || !value.trim()) continue;
            if (value === sceneDefaults[key] && key !== 'depth' && !p.explicit?.[key]) continue;
            if (key === 'complexity' && fixedBackground) continue;
            environment.push(label + '：' + value);
          }
          if (constrainedBackground && app !== 'subtle')
            notices.push('当前模式优先保证人物展示，已限制背景细节密度');

          const interaction = p.interaction !== sceneDefaults.interaction ? p.interaction : '';
          const fusionAction = p.fusionEnabled && (p.explicit?.action || p.action !== sceneDefaults.action)
            ? p.action
            : '';
          if (!allowsAction && (interaction || fusionAction))
            notices.push('当前模式的构图或姿态已固定，未追加环境互动动作');
          if (allowsAction && interaction && fusionAction && interaction !== fusionAction)
            notices.push('环境互动与融合动作同时设置，采用融合动作');
          const action = allowsAction && (fusionAction || interaction || (mode === 'full' && '自然站姿'));
          const fusion = [
            action && action !== '无互动' && '人物动作：' + action,
            p.fusionEnabled && '人物与环境共享一致的空间尺度、透视和主光方向',
          ];
          if (p.fusionEnabled) {
            if (!fixedBackground && p.position) fusion.push('人物位置：' + p.position);
            if (!fixedBackground && app === 'integrated' && p.strength)
              fusion.push('视觉重心：' + p.strength);
            if (p.color) fusion.push('色彩融合：' + p.color);
            if (p.response && mode !== 'face') fusion.push('环境响应：' + p.response);
          }
          if (/夜晚/.test(time) && /自然日光/.test(lighting))
            notices.push('夜晚与自然日光同时启用，请检查场景光照');
          const template = sceneLibraryEnabled && !motif ? sceneLibraryText : '';
          const custom = typeof p.custom === 'string' ? p.custom : '';
          const authored = [template, custom].join(' ');
          if (/全景清晰/.test(p.depth) && /虚化|浅景深|背景失焦/.test(authored))
            notices.push('全景清晰与自定义描述中的虚化要求可能冲突');
          if (/无建筑|不要建筑|禁止建筑/.test(custom) && /楼阁|宫殿|建筑|古堡|亭台|回廊/.test(motif || template))
            notices.push('自定义的建筑排除要求与场景素材可能冲突');
          showNotices(notices);

          const blocks = [section('07 · 场景与氛围', environment)];
          if (fusion.some(Boolean)) blocks.push(section('08 · 人物与场景', fusion));
          if (template.trim()) blocks.push('【场景模板原文】\n' + template);
          if (custom.trim()) blocks.push('【自定义场景要求】\n' + custom);
          return { enabled: true, blocks };
        };
        generate();
      })();
