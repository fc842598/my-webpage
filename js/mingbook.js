(function () {
  const chapters = [
    { key: 'chart', no: '第一章', name: '命盘', icon: '☼' },
    { key: 'summary', no: '第二章', name: '总批', icon: '◒' },
    { key: 'special', no: '第三章', name: '专项', icon: '❖' },
    { key: 'fortune', no: '第四章', name: '大运', icon: '⌁' },
    { key: 'oracle', no: '第五章', name: '半仙', icon: '…' },
    { key: 'report', no: '第六章', name: '报告', icon: '▤' },
  ];

  const specials = [
    { key: 'body', label: '身宫', icon: '♙' },
    { key: 'marriage', label: '婚姻', icon: '♡' },
    { key: 'health', label: '健康', icon: '♥' },
    { key: 'wealth', label: '财运', icon: '♧' },
    { key: 'career', label: '事业', icon: '▣' },
  ];

  const state = {
    chapter: new URLSearchParams(location.search).get('chapter') || 'chart',
    special: new URLSearchParams(location.search).get('special') || 'marriage',
  };

  const chapterNav = document.getElementById('chapterNav');
  const chapterContent = document.getElementById('chapterContent');
  const chapterActions = document.getElementById('chapterActions');
  const actionsTitle = document.getElementById('actionsTitle');
  const actionNote = document.getElementById('actionNote');
  const specialTabs = document.getElementById('specialTabs');
  const toast = document.getElementById('toast');

  function setChapter(key) {
    state.chapter = key;
    render();
  }

  function setSpecial(key) {
    state.special = key;
    state.chapter = 'special';
    render();
  }

  function toastText(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function button(label, target, extraClass = '') {
    return `<button class="${extraClass}" type="button" data-chapter="${target}">${label}</button>`;
  }

  function renderNav() {
    chapterNav.innerHTML = chapters.map((item) => `
      <button class="yt-chapter-btn" type="button" data-chapter="${item.key}" aria-current="${item.key === state.chapter ? 'page' : 'false'}">
        <span class="yt-chapter-icon">${item.icon}</span>
        <span>
          <span class="yt-chapter-kicker">${item.no}</span>
          <span class="yt-chapter-name">${item.name}</span>
        </span>
      </button>
    `).join('');
  }

  function renderSpecialTabs() {
    specialTabs.innerHTML = specials.map((item) => `
      <button type="button" data-special="${item.key}" aria-pressed="${item.key === state.special}">
        ${item.icon}　${item.label}
      </button>
    `).join('');
  }

  function paperHead(stamp, title, subtitle) {
    return `
      <span class="paper-stamp">${stamp}</span>
      <h1 class="paper-title">${title}</h1>
      <p class="paper-subtitle">${subtitle}</p>
    `;
  }

  function renderChart() {
    return `
      ${paperHead('第一章 · 命盘', '紫微命盘', '命盘为根，先看总览，再按章节展开各宫详批。')}
      <div class="mingpan-grid">
        <section class="palace-mini">
          <h2>命盘核心</h2>
          <p>庚午年 · 巳时 · 紫微天府</p>
          <div class="palace-grid">
            ${['巳 夫妇', '午 太阳', '未 天府', '申 文曲', '辰 财帛', '命宫', '酉 天同', '卯 天机', '戌 太阴', '寅 福德', '丑 七杀', '亥 天梁']
              .map((text) => `<div class="palace-cell ${text === '命宫' ? 'active' : ''}">${text}</div>`).join('')}
          </div>
        </section>
        <section class="chapter-list">
          ${[
            ['命盘总览', '命主格局偏稳，主星落点清晰，当前适合先看命宫、身宫与事业三处。'],
            ['先天格局', '格局层次、三方四正、人生底色。'],
            ['十二宫详解', '命宫、财帛、官禄、夫妻等宫位。'],
            ['四化与五行', '生年四化与五行流转。'],
            ['时辰校验', '不知道时辰时，进入天纪推时辰。'],
          ].map((row, index) => `
            <button type="button" data-toast="${row[1]}">
              <b>${String(index + 1).padStart(2, '0')}</b>
              <span><strong>${row[0]}</strong><small>${row[1]}</small></span>
              <span>∨</span>
            </button>
          `).join('')}
        </section>
      </div>
      <a class="paper-cta" href="#" data-chapter="summary">继续看第二章 · 总批</a>
    `;
  }

  function renderSummary() {
    const points = [
      ['先天格局', '日主壬水，生于巳月，火旺水弱，幸得庚金相生。'],
      ['性格特质', '聪明机敏，思维活跃，外柔内刚，富有同理心。'],
      ['事业财运', '利于学术、策划、咨询、技术与资源整合。'],
      ['感情婚姻', '重视精神契合，宜晚婚，更利于长久。'],
      ['关键提醒', '先稳节奏，再求突破；流年起伏需结合大运看。'],
    ];
    return `
      ${paperHead('第二章 · 总批', 'AI 整体批命', '先天格局 · 人生底色 · 命运趋势')}
      <div class="summary-grid">
        <section class="key-points">
          ${points.map((item) => `
            <div class="key-point">
              <span>◇</span>
              <div><b>${item[0]}</b><p>${item[1]}</p></div>
            </div>
          `).join('')}
        </section>
        <aside class="evidence-panel">
          <h3>批命依据</h3>
          ${[
            ['命盘总览', '命宫、身宫、四柱、三方四正综合判断。'],
            ['命格定位', '水火交界，先稳心气，再借金生水。'],
            ['格局优势', '善思辨，适合技术整合与咨询。'],
          ].map((item) => `<div class="evidence-card"><strong>${item[0]}</strong><p>${item[1]}</p></div>`).join('')}
        </aside>
      </div>
      <a class="paper-cta" href="#" data-chapter="special">继续看第三章 · 专项</a>
    `;
  }

  function renderSpecial() {
    const current = specials.find((item) => item.key === state.special) || specials[1];
    const detailMap = {
      body: ['身宫深度解析', '洞察自我本质与内在能量格局。'],
      marriage: ['婚姻深度解析', '解读情感模式、配偶特质与婚姻关系走向。'],
      health: ['健康深度解析', '关注身体状态、调理方向与生活节奏。'],
      wealth: ['财运深度解析', '分析财富层次、赚钱能力与风险提示。'],
      career: ['事业深度解析', '判断事业方向、职业优势与发展路径。'],
    };
    return `
      ${paperHead('第三章 · 专项', detailMap[current.key][0], detailMap[current.key][1])}
      <div class="special-overview">
        ${specials.map((item) => `
          <button class="special-card" type="button" data-special="${item.key}">
            <span class="special-icon">${item.icon}</span>
            <strong>${item.label}</strong>
            <p>${detailMap[item.key][1]}</p>
          </button>
        `).join('')}
      </div>
      <section class="fortune-detail" style="margin-top:24px">
        <div>
          <h2>${detailMap[current.key][0]}</h2>
          <p>本页聚合命盘、流年与专项宫位，先看核心判断，再结合右侧动作继续追问或生成报告。</p>
        </div>
        <aside class="evidence-panel">
          <h3>命盘依据</h3>
          <div class="evidence-card"><strong>核心宫位</strong><p>命宫、身宫、对应专项宫位。</p></div>
          <div class="evidence-card"><strong>阅读建议</strong><p>先看重点，再进入对应专项深读。</p></div>
        </aside>
      </section>
    `;
  }

  function renderFortune() {
    return `
      ${paperHead('第四章 · 大运', '大运流年', '十年一势 · 一年一落点')}
      <div class="fortune-years">
        ${['13-22 天机', '23-32 太阳', '33-42 武曲', '43-52 天同', '53-62 廉贞', '63-72 天府']
          .map((item, index) => `<div class="fortune-card ${index === 2 ? 'active' : ''}"><strong>${item}</strong><p>${index === 2 ? '86分' : '待批'}</p></div>`).join('')}
      </div>
      <section class="fortune-detail">
        <div>
          <h2>当前大运：33-42岁 · 武曲</h2>
          <p>事业上升、资源整合与执行突破。2025-2027 为重要窗口，适合主动争取、提高决策密度。</p>
          <p>风险在于节奏过急、健康消耗与人际摩擦，宜稳中求进。</p>
        </div>
        <aside class="evidence-panel">
          <h3>大运依据</h3>
          <div class="evidence-card"><strong>AI评分</strong><p>86分，机会强。</p></div>
          <div class="evidence-card"><strong>未来三年</strong><p>2025破局，2026沉淀，2027推进。</p></div>
        </aside>
      </section>
      <a class="paper-cta" href="#" data-chapter="report">生成深度报告</a>
    `;
  }

  function renderOracle() {
    return `
      <section class="chat-page">
        <div>
          ${paperHead('第五章 · 半仙', '许半仙追问', '我会记住你的命盘，一步步陪你把人生看清楚')}
          <div class="memory-row">
            <div class="memory-card"><strong>命盘摘要</strong><p>日主壬水，格局中上。</p></div>
            <div class="memory-card"><strong>当前大运</strong><p>33-42岁 · 武曲大运。</p></div>
            <div class="memory-card"><strong>最近解读</strong><p>事业、婚姻、流年节点。</p></div>
          </div>
        </div>
        <div class="chat-log" id="chatLog">
          <div class="chat-msg">
            <span class="chat-avatar">仙</span>
            <p class="chat-bubble">命盘我已经记下。你想先问感情、事业，还是今年运势？</p>
          </div>
          <div class="chat-msg">
            <span class="chat-avatar">你</span>
            <p class="chat-bubble">我今年事业上会有突破吗？</p>
          </div>
          <div class="chat-msg">
            <span class="chat-avatar">仙</span>
            <p class="chat-bubble">今年事业有机会，但要避免急进。先稳住核心项目，再扩大合作。</p>
          </div>
        </div>
        <form class="ask-row" id="askForm">
          <input id="askInput" autocomplete="off" placeholder="继续追问你的命盘...">
          <button class="ask-send" type="submit">›</button>
        </form>
      </section>
    `;
  }

  function renderReport() {
    const rows = [
      ['第一章', '命盘总览', '命盘结构、四化分布、五行能量、先天优势与不足'],
      ['第二章', '先天格局', '格局层次、喜用神、人生底色、命运主线'],
      ['第三章', '感情婚姻', '感情模式、配偶特质、婚姻走势、关键时间点'],
      ['第四章', '事业财运', '职业方向、事业发展、财富格局、贵人助力'],
      ['第五章', '大运流年', '十年大运走势、流年关键节点、运势起伏'],
      ['第六章', '未来建议', '人生策略、风险规避、行动指南、提升建议'],
    ];
    return `
      ${paperHead('第六章 · 报告', '命主深度报告', '一份关于你命运的完整解读')}
      <div class="report-list">
        ${rows.map((row) => `
          <button class="report-row" type="button" data-toast="${row[2]}">
            <span>▣</span>
            <strong>${row[1]}</strong>
            <small>${row[2]}</small>
            <span>∨</span>
          </button>
        `).join('')}
      </div>
      <a class="paper-cta" href="#" data-toast="正在整理命书报告内容">生成深度报告</a>
    `;
  }

  const renderers = {
    chart: renderChart,
    summary: renderSummary,
    special: renderSpecial,
    fortune: renderFortune,
    oracle: renderOracle,
    report: renderReport,
  };

  function renderActions() {
    const actionMap = {
      chart: [
        ['summary', '继续看总批', '进入 AI 整体批命', '↗'],
        ['oracle', '不知道时辰', '打开天纪推时辰', '?'],
        ['report', '生成深度报告', '补全后生成报告', '▤'],
      ],
      summary: [
        ['fortune', '继续看大运', '进入人生运势线', '↗'],
        ['report', '生成深度报告', '生成完整报告', '▤'],
      ],
      special: [
        ['special:marriage', '先看婚姻', '了解感情模式与婚姻缘分', '♡'],
        ['special:career', '事业财运', '把握事业方向和财力潜能', '▣'],
        ['summary', '返回总批', '回到第二章 AI整体批命', '↺'],
      ],
      fortune: [
        ['report', 'AI批整组大运', '十年运势展开', '⌁'],
        ['report', '看人生曲线', '掌握高低起伏', '↗'],
      ],
      oracle: [
        ['report', '生成深度报告', '整合问答结果', '▤'],
        ['summary', '回看总批', '查看整体命局解读', '↺'],
        ['fortune', '查看大运', '验证运势走势', '⌁'],
      ],
      report: [
        ['report', '全面报告', '全维度命书内容', '♛'],
        ['special:marriage', '感情重点', '聚焦婚姻问题', '♡'],
        ['special:career', '事业财运重点', '聚焦事业财富方向', '▣'],
      ],
    };
    const list = actionMap[state.chapter] || actionMap.chart;
    actionsTitle.textContent = state.chapter === 'special' ? '推荐先看' : '后续动作';
    actionNote.textContent = state.chapter === 'report'
      ? '报告页汇总六章重点，适合最后统一查看。'
      : '按章节阅读命书，重要内容可继续追问或生成报告。';
    chapterActions.innerHTML = list.map((item, index) => `
      <button class="yt-action ${index === 0 ? 'primary' : ''}" type="button" data-action="${item[0]}">
        <span class="yt-action-icon">${item[3]}</span>
        <span><strong>${item[1]}</strong><span>${item[2]}</span></span>
        <b>›</b>
      </button>
    `).join('');
  }

  function render() {
    if (!renderers[state.chapter]) state.chapter = 'chart';
    renderNav();
    renderSpecialTabs();
    chapterContent.classList.toggle('scrollable', state.chapter === 'special' || state.chapter === 'oracle');
    chapterContent.innerHTML = renderers[state.chapter]();
    renderActions();
    history.replaceState(null, '', `?chapter=${state.chapter}&special=${state.special}`);
  }

  document.addEventListener('click', (event) => {
    const chapterTarget = event.target.closest('[data-chapter]');
    if (chapterTarget) {
      event.preventDefault();
      setChapter(chapterTarget.dataset.chapter);
      return;
    }
    const specialTarget = event.target.closest('[data-special]');
    if (specialTarget) {
      event.preventDefault();
      setSpecial(specialTarget.dataset.special);
      return;
    }
    const actionTarget = event.target.closest('[data-action]');
    if (actionTarget) {
      const action = actionTarget.dataset.action;
      if (action.startsWith('special:')) setSpecial(action.split(':')[1]);
      else setChapter(action);
      return;
    }
    const toastTarget = event.target.closest('[data-toast]');
    if (toastTarget) {
      event.preventDefault();
      toastText(toastTarget.dataset.toast);
    }
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'askForm') return;
    event.preventDefault();
    const input = document.getElementById('askInput');
    if (!input || !input.value.trim()) return;
    toastText('半仙已收到你的追问');
    input.value = '';
  });

  render();
})();
