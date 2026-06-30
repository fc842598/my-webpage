import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "articles", "en");
mkdirSync(outDir, { recursive: true });

const today = "2026-06-30";
const site = "https://yuetianai.com";

const articles = [
  {
    zh: "mianfei-ziwei-paipan-hou-xian-kan-shenme.html",
    slug: "how-to-read-zi-wei-dou-shu-chart.html",
    category: "Beginner Guide",
    title: "How to Read a Zi Wei Dou Shu Chart After You Generate It",
    description: "A plain-English reading order for a Zi Wei Dou Shu chart: start with the Life Palace, then the Body Palace, the career-money-outside pattern, and the current year.",
    subtitle: "Start with the chart structure before asking for a prediction.",
    lead: "A Zi Wei Dou Shu chart can look crowded at first. The useful move is not to memorize every star name. Start by asking what each part of the chart is responsible for.",
    sections: [
      ["Start With the Person", "Begin with the Life Palace. In plain English, this is the person’s baseline: temperament, default style, and the kind of life questions that keep returning."],
      ["Then Look at Real-World Pressure", "The Body Palace shows where life tends to push the person later on. It may be money, career, relationships, or the outside world. This is why two people with similar personalities can build very different lives."],
      ["Do Not Read One Box Alone", "For work and money, read the Life Palace together with the Wealth Palace, Career Palace, and Outside Palace. One part shows the person, one shows money, one shows role, and one shows the environment."],
      ["Use It Practically", "A good reading order is simple: person first, life pressure second, work-money environment third, timing last. That keeps the chart grounded instead of turning it into vague fortune telling."]
    ],
    next: "life-palace.html"
  },
  {
    zh: "ai-ziwei-paipan-zenme-xuan.html",
    slug: "best-free-zi-wei-dou-shu-chart.html",
    category: "Tool Guide",
    title: "How to Choose a Free Zi Wei Dou Shu Chart Website",
    description: "For English readers comparing free Zi Wei Dou Shu chart tools: look for a clear chart, privacy basics, readable explanations, and practical next steps.",
    subtitle: "A good tool should make the chart easier to read, not more mysterious.",
    lead: "Many people search for a free Zi Wei Dou Shu chart and stop at the first page that looks impressive. A better test is whether the tool helps you understand the chart in a calm, organized way.",
    sections: [
      ["Look for a Clear Chart", "The twelve palaces should be easy to find. If you cannot tell where Life, Wealth, Career, and Outside are, the tool is already making the reading harder."],
      ["Avoid Fear-Based Copy", "A good reading should not scare people into paying. It should explain what a pattern means and what kind of real-life decisions it may affect."],
      ["Check the Next Step", "After the chart is generated, the site should help you read in order: the person, the life focus, work and money, then timing."],
      ["Use Plain Questions", "Good questions are practical: What is my work style? Where does money come from? Is this year more about movement, career, or cash flow?"]
    ],
    next: "how-to-read-zi-wei-dou-shu-chart.html"
  },
  {
    zh: "ai-suanming-wangzhan-zenme-xuan.html",
    slug: "ai-fortune-telling-sites.html",
    category: "Tool Guide",
    title: "How to Judge an AI Fortune-Telling Website",
    description: "A practical guide for English users: judge AI astrology and fortune-telling websites by clarity, boundaries, privacy, and whether the answer helps real decisions.",
    subtitle: "The best sign is not drama. It is useful structure.",
    lead: "AI fortune-telling tools can sound confident. That does not mean they are useful. A better tool explains the logic, keeps boundaries clear, and helps you think through a real situation.",
    sections: [
      ["Look for Structure", "If the answer jumps straight to dramatic predictions, be careful. A better answer explains the chart area, the strength of the pattern, and the real-life context."],
      ["Check the Tone", "Good astrology content should not trap people in fear. It should show possible pressure points and practical ways to respond."],
      ["Privacy Matters", "Birth data can feel personal. A serious site should be clear about what it asks for and why."],
      ["Use It as a Thinking Tool", "The best use is not blind belief. Use it to organize questions about work, money, relationships, movement, and timing."]
    ],
    next: "best-free-zi-wei-dou-shu-chart.html"
  },
  {
    zh: "yuetianai-shi-shenme.html",
    slug: "what-is-yuetianai.html",
    category: "About",
    title: "What Is YuetianAI?",
    description: "YuetianAI is a Chinese metaphysics and Zi Wei Dou Shu chart-reading site focused on structured, practical readings rather than fear-based predictions.",
    subtitle: "A structured way to explore a Zi Wei Dou Shu chart.",
    lead: "YuetianAI is built for people who want a clearer way to read a Chinese astrology chart. The goal is not to make the chart sound mystical, but to turn it into a useful map of questions.",
    sections: [
      ["What It Focuses On", "The site focuses on Zi Wei Dou Shu, a traditional Chinese chart system that uses twelve life areas, stars, and timing cycles."],
      ["How to Use It", "Start with a chart, then read the Life Palace, Body Palace, Wealth Palace, Career Palace, Outside Palace, and current timing."],
      ["Who It Helps", "It is useful for people who want to think about work direction, money habits, relationship patterns, and life timing in a structured way."],
      ["What It Avoids", "The site should not be read as medical, legal, or financial certainty. It works best as a reflective framework."]
    ],
    next: "how-to-read-zi-wei-dou-shu-chart.html"
  },
  {
    zh: "ziwei-minggong.html",
    slug: "life-palace.html",
    category: "Twelve Palaces",
    title: "Life Palace in Zi Wei Dou Shu: What It Means",
    description: "The Life Palace is the starting point of a Zi Wei Dou Shu chart. Learn how to read it without getting lost in technical star names.",
    subtitle: "The Life Palace shows the person, not the whole story.",
    lead: "The Life Palace is the first place to look because it describes the person’s baseline. But it should never be read alone.",
    sections: [
      ["What It Shows", "It shows temperament, default reactions, and the kind of life path that feels natural to the person."],
      ["What It Does Not Show", "It does not answer every question by itself. Money, career, relationships, and timing all need their own areas."],
      ["A Simple Combination", "Life Palace plus Wealth Palace shows whether the person can connect their style to income. Life Palace plus Career Palace shows whether their role fits them."],
      ["How to Use It", "Start here, then read Wealth, Career, and Outside together. This keeps the chart human and practical."]
    ],
    next: "wealth-palace.html"
  },
  {
    zh: "ziwei-xiongdigong.html",
    slug: "siblings-palace.html",
    category: "Twelve Palaces",
    title: "Siblings Palace in Zi Wei Dou Shu: Peers, Sharing, and Boundaries",
    description: "The Siblings Palace is not only about brothers and sisters. It also points to peers, shared resources, and cooperation boundaries.",
    subtitle: "Read it as the peer-and-sharing area of the chart.",
    lead: "For modern readers, the Siblings Palace can include siblings, peers, classmates, partners at the same level, and people who share resources with you.",
    sections: [
      ["What It Shows", "It shows whether peer relationships tend to help, drain, compete, or require clear boundaries."],
      ["Money and Boundaries", "When money-related patterns touch this palace, shared money and informal cooperation should be handled carefully."],
      ["Modern Example", "A friend wants to start a side business with you. This palace helps you ask whether the relationship can handle money pressure."],
      ["How to Use It", "Use written agreements, clear roles, and clean boundaries when this area carries pressure."]
    ],
    next: "spouse-palace.html"
  },
  {
    zh: "ziwei-fuqigong.html",
    slug: "spouse-palace.html",
    category: "Twelve Palaces",
    title: "Spouse Palace in Zi Wei Dou Shu: Relationship Style",
    description: "The Spouse Palace helps read relationship style, partnership pressure, and how a person tends to meet or handle committed relationships.",
    subtitle: "It is about relationship patterns, not just marriage status.",
    lead: "The Spouse Palace is often misunderstood as a simple yes-or-no answer about marriage. A better reading asks what kind of relationship pattern appears.",
    sections: [
      ["What It Shows", "It shows how partnership enters life, what kind of partner dynamic is likely, and where pressure may appear."],
      ["Read the Opposite Area", "Relationship does not live only in one palace. Inner comfort, values, and long-term emotional capacity also matter."],
      ["Modern Example", "A chart may show attraction and pressure at the same time. That means boundaries and communication matter more than romantic intensity."],
      ["How to Use It", "Use this palace to understand relationship rhythm, not to force a fixed prediction."]
    ],
    next: "children-palace.html"
  },
  {
    zh: "ziwei-zinvgong.html",
    slug: "children-palace.html",
    category: "Twelve Palaces",
    title: "Children Palace in Zi Wei Dou Shu: Legacy, Output, and Responsibility",
    description: "The Children Palace can be read as children, creative output, long-term responsibility, and what continues after you.",
    subtitle: "Think beyond children only: it also shows output and extension.",
    lead: "The Children Palace can refer to children, but modern readers can also use it for output, creative extension, students, products, and responsibility that continues.",
    sections: [
      ["What It Shows", "It shows how a person invests energy into something that grows beyond them."],
      ["Modern Example", "For a creator, this palace can describe work released to an audience. For a teacher, it may describe students and mentoring."],
      ["Pressure Pattern", "If the palace carries pressure, the issue may be over-responsibility, worry, or difficulty letting outcomes grow naturally."],
      ["How to Use It", "Ask what you are responsible for creating, raising, teaching, or releasing."]
    ],
    next: "wealth-palace.html"
  },
  {
    zh: "ziwei-caibogong.html",
    slug: "wealth-palace.html",
    category: "Twelve Palaces",
    title: "Wealth Palace in Zi Wei Dou Shu: How Money Comes In",
    description: "The Wealth Palace is about how money is made and handled. Read it with career, outside opportunities, and the person’s baseline.",
    subtitle: "Do not ask only how much money. Ask where the money comes from.",
    lead: "The Wealth Palace is not just a money score. It is a way to understand income path, resources, risk, and cash flow.",
    sections: [
      ["Income Path", "Some people earn through a stable role, some through clients and projects, some through outside markets or platforms."],
      ["Career vs Money", "Money in the Career area may mean financial responsibility at work, not instant personal wealth."],
      ["Plain Examples", "A strong Wealth Palace can point to direct income skill. Wealth connected to the Outside Palace may mean clients, travel, online platforms, or a bigger market."],
      ["How to Use It", "Use this area to choose a money strategy: stable job, professional service, project work, business, or market expansion."]
    ],
    next: "career-palace.html"
  },
  {
    zh: "ziwei-jiegong.html",
    slug: "health-palace.html",
    category: "Twelve Palaces",
    title: "Health Palace in Zi Wei Dou Shu: Pressure, Weak Points, and Care",
    description: "The Health Palace should be read carefully as a pressure and self-care area, not as a replacement for medical advice.",
    subtitle: "Use it as a reminder to care for stress and weak points.",
    lead: "The Health Palace is a sensitive area. It should not be used to scare people or replace professional care.",
    sections: [
      ["What It Shows", "It can show where the body and lifestyle may carry pressure: stress, recovery, habits, and long-term care."],
      ["Modern Use", "Read it as a prompt for sleep, workload, medical checkups, and stress management."],
      ["Pressure Pattern", "If this area is under pressure in a year, do not panic. Reduce risk and pay attention to routine."],
      ["How to Use It", "Use practical care first: rest, checks, routine, and professional help when needed."]
    ],
    next: "outside-palace.html"
  },
  {
    zh: "ziwei-qianyigong.html",
    slug: "outside-palace.html",
    category: "Twelve Palaces",
    title: "Outside Palace in Zi Wei Dou Shu: Travel, Markets, and Platforms",
    description: "The Outside Palace shows what happens beyond your familiar environment: travel, relocation, public exposure, clients, and larger platforms.",
    subtitle: "It is not only travel. It is the outside world.",
    lead: "The Outside Palace is often translated as travel or migration. For modern readers, it is better to think of it as the outside environment.",
    sections: [
      ["What It Shows", "It can show whether a person grows by leaving the familiar place: a new city, company, client base, online platform, or public audience."],
      ["Money Outside", "If money connects here, income may open through outside clients, remote work, cross-region business, or a larger market."],
      ["A Simple Example", "Someone may look average in a small environment but become visible after moving to a stronger platform."],
      ["How to Use It", "Ask whether movement expands the person or only creates more cost and pressure."]
    ],
    next: "career-palace.html"
  },
  {
    zh: "ziwei-puyigong.html",
    slug: "friends-network-palace.html",
    category: "Twelve Palaces",
    title: "Friends and Network Palace in Zi Wei Dou Shu",
    description: "This palace points to friends, helpers, teams, staff, audiences, and cooperation risks in a modern reading.",
    subtitle: "Read it as your human network.",
    lead: "The traditional label can sound old-fashioned. In modern life, this palace includes friends, colleagues, teams, communities, clients, and people around a project.",
    sections: [
      ["What It Shows", "It shows whether the people around you bring support, confusion, competition, or pressure."],
      ["Modern Example", "A startup founder needs to know whether partners and staff can carry responsibility. This palace helps frame that question."],
      ["Risk Pattern", "If pressure appears here, avoid vague agreements and emotional hiring. Define roles and money clearly."],
      ["How to Use It", "Use it for cooperation decisions, team building, and judging whether a network is helpful."]
    ],
    next: "career-palace.html"
  },
  {
    zh: "ziwei-guanlugong.html",
    slug: "career-palace.html",
    category: "Twelve Palaces",
    title: "Career Palace in Zi Wei Dou Shu: Role, Responsibility, and Position",
    description: "The Career Palace is about role and responsibility. Read it with the Wealth Palace to separate career position from income path.",
    subtitle: "Career is not only industry. It is the role you can carry.",
    lead: "The Career Palace does not simply tell you a job title. It helps show whether a person fits leadership, professional work, support roles, or organizational responsibility.",
    sections: [
      ["Role First", "Ask what position the person can hold: manager, specialist, operator, advisor, builder, or public-facing role."],
      ["Career vs Wealth", "A strong career pattern may bring responsibility before money. A strong money pattern may point to clients or business before title."],
      ["Plain Examples", "Career with strong authority can fit management or project ownership. Wealth inside the career area may mean handling budgets or resources for an organization."],
      ["How to Use It", "Use this palace to choose the right work role before chasing a title."]
    ],
    next: "property-palace.html"
  },
  {
    zh: "ziwei-tianzhaigong.html",
    slug: "property-palace.html",
    category: "Twelve Palaces",
    title: "Property Palace in Zi Wei Dou Shu: Home, Assets, and Stability",
    description: "The Property Palace shows home, real estate, family base, long-term assets, and the sense of having a stable place.",
    subtitle: "It is about foundation, not only houses.",
    lead: "The Property Palace is commonly linked to real estate, but its deeper use is foundation: where a person feels rooted and what can be built over time.",
    sections: [
      ["What It Shows", "It can show home environment, property, inherited resources, and whether stability is easy or hard to build."],
      ["Modern Use", "For modern readers, this includes rent or ownership, family support, workspace, and long-term asset planning."],
      ["Pressure Pattern", "Pressure here may show frequent moves, housing stress, or family-resource complications."],
      ["How to Use It", "Use it to plan stability: home, savings, property, family boundaries, and a place to build from."]
    ],
    next: "inner-life-palace.html"
  },
  {
    zh: "ziwei-fudegong.html",
    slug: "inner-life-palace.html",
    category: "Twelve Palaces",
    title: "Inner Life Palace in Zi Wei Dou Shu: Mindset, Rest, and Endurance",
    description: "Often called the Fortune or Mental Palace, this area shows inner reserves, emotional comfort, rest, and long-term endurance.",
    subtitle: "It shows whether the person can live with the path they choose.",
    lead: "This palace is hard to translate directly. For English readers, Inner Life Palace is often clearer than a literal label.",
    sections: [
      ["What It Shows", "It shows inner comfort, spiritual reserves, rest style, and whether a person can sustain pressure."],
      ["Money Connection", "When the Wealth Palace is active, the opposite inner-life area matters too. Money stress can become mental stress."],
      ["Modern Example", "A person may earn well but feel constantly unsafe. This palace helps explain that gap."],
      ["How to Use It", "Use it to ask what kind of lifestyle the person can actually sustain."]
    ],
    next: "parents-palace.html"
  },
  {
    zh: "ziwei-fumugong.html",
    slug: "parents-palace.html",
    category: "Twelve Palaces",
    title: "Parents Palace in Zi Wei Dou Shu: Family Influence and Support",
    description: "The Parents Palace shows early influence, elders, rules, protection, pressure, and the kind of support a person may receive.",
    subtitle: "It is about early structure and authority.",
    lead: "The Parents Palace is not only about mother and father. It can also show elders, teachers, authority, background support, and early rules.",
    sections: [
      ["What It Shows", "It shows whether early structure feels supportive, demanding, distant, or resourceful."],
      ["Modern Use", "This can include family expectations, educational support, professional mentors, and the way a person handles authority."],
      ["Pressure Pattern", "If pressure appears here, the person may carry family rules or elder expectations into adult decisions."],
      ["How to Use It", "Use it to separate inherited pressure from the person’s own path."]
    ],
    next: "body-palace.html"
  },
  {
    zh: "ziwei-shengong.html",
    slug: "body-palace.html",
    category: "Reading Method",
    title: "Body Palace in Zi Wei Dou Shu: Where Life Pushes You Later",
    description: "The Body Palace shows later-life focus: money, career, movement, relationship, or another area that becomes hard to ignore.",
    subtitle: "The Life Palace shows the person. The Body Palace shows where reality pushes.",
    lead: "The Body Palace is one of the most useful ideas for modern readers because it explains why a person may grow into a different life focus over time.",
    sections: [
      ["Start With Its Location", "Body in Wealth points to money and resources. Body in Career points to role and responsibility. Body in Outside points to movement, platforms, and environments."],
      ["Then Read the Strength", "Supportive stars make that area useful. Pressure patterns make it a repeating life lesson."],
      ["Plain Examples", "Body in Wealth with a professional pattern can mean income through skill. Body in Outside can mean growth through changing environments."],
      ["How to Use It", "Read the Body Palace after the Life Palace, then connect it to timing."]
    ],
    next: "triad-and-opposite.html"
  },
  {
    zh: "ziwei-sanfang-sizheng.html",
    slug: "triad-and-opposite.html",
    category: "Reading Method",
    title: "Triad and Opposite in Zi Wei Dou Shu: Read Four Areas Together",
    description: "A plain-English guide to the Zi Wei Dou Shu triad and opposite method: read the main area together with money, career, and outside environment.",
    subtitle: "One palace is not enough. Read the surrounding structure.",
    lead: "A common beginner mistake is reading one palace as if it tells the whole story. The triad-and-opposite method keeps the reading in context.",
    sections: [
      ["The Simple Idea", "Take the main area, then read the connected money, career, and outside-environment areas. This shows whether the topic has support."],
      ["Why It Matters", "A person may have talent but no platform, a job role but weak income, or money opportunity but poor timing."],
      ["Plain Example", "For career: Life shows the person, Wealth shows income path, Career shows role, and Outside shows market or platform."],
      ["How to Use It", "When reading any life question, ask what the central area is and what the surrounding structure says."]
    ],
    next: "palace-context.html"
  },
  {
    zh: "ziwei-gongxing.html",
    slug: "palace-context.html",
    category: "Reading Method",
    title: "Palace Context in Zi Wei Dou Shu: Why Location Comes First",
    description: "In Zi Wei Dou Shu, a star changes meaning depending on where it lands. Learn the plain-English idea of palace context.",
    subtitle: "A symbol means different things in different life areas.",
    lead: "The same star or pattern should not be read the same way everywhere. Location tells you what part of life is being activated.",
    sections: [
      ["Location First", "A money pattern in the Wealth Palace is about money. The same pressure in the Relationship Palace is about relationship dynamics."],
      ["Annual Timing", "When a year lands in Wealth, money and cash flow become the first question. When it lands in Outside, movement and environment become the first question."],
      ["Plain Example", "Do not read a symbol in isolation. Ask: Is this about work, money, travel, health, family, or relationship?"],
      ["How to Use It", "Always name the life area first, then read the symbol inside that area."]
    ],
    next: "four-transformations.html"
  },
  {
    zh: "ziwei-kequanlu.html",
    slug: "four-transformations.html",
    category: "Reading Method",
    title: "The Four Transformations in Zi Wei Dou Shu: Fame, Power, Gain, and Friction",
    description: "A plain-English guide to the four transformations: recognition, authority, gain, and friction. Read them by the life area where they appear.",
    subtitle: "Do not memorize labels. Understand what each one does.",
    lead: "The four transformations are easier to understand when translated into modern language: recognition, authority, gain, and friction.",
    sections: [
      ["Recognition", "This points to reputation, learning, documentation, exams, credentials, or being seen as professional."],
      ["Authority", "This points to responsibility, control, decision-making, pressure, or being put in charge."],
      ["Gain", "This points to resources, comfort, income, opportunity, or something that flows toward the person."],
      ["Friction", "This points to blockage, worry, debt, delay, obsession, or something that needs careful handling."]
    ],
    next: "ten-year-cycle.html"
  },
  {
    zh: "ziwei-daxian.html",
    slug: "ten-year-cycle.html",
    category: "Reading Method",
    title: "Ten-Year Cycle in Zi Wei Dou Shu: Why Timing Changes the Reading",
    description: "The ten-year cycle shows the main life theme of a decade. Read it after the birth chart and before the annual year.",
    subtitle: "The birth chart is the base. The decade shows the road.",
    lead: "A person may have an ordinary birth chart but enter a very strong decade. Another person may have a strong base but go through a heavy period.",
    sections: [
      ["What It Shows", "The ten-year cycle shows which life area becomes heavy, active, or important for that decade."],
      ["Read the Structure", "Do not read only one box. Read the decade area with money, career, outside environment, and the opposite area."],
      ["Plain Examples", "A career-heavy decade can bring responsibility before income. A wealth-heavy decade can bring more money decisions and cash-flow pressure."],
      ["How to Use It", "Read birth chart first, decade second, annual year third. That gives the reading a timeline."]
    ],
    next: "annual-cycle.html"
  },
  {
    zh: "ziwei-xiaoxian-liunian.html",
    slug: "annual-cycle.html",
    category: "Reading Method",
    title: "Annual Cycle in Zi Wei Dou Shu: What This Year Activates",
    description: "The annual cycle shows what this year activates. Start with the palace it lands in, then read the opposite area and the star pattern.",
    subtitle: "This year is not everything. It is the current trigger.",
    lead: "Annual reading becomes clearer when you stop asking for a general prediction and start asking what life area is being activated this year.",
    sections: [
      ["Start With the Area", "If the annual cycle lands in Wealth, ask about cash flow. If it lands in Outside, ask about movement, platforms, and environment."],
      ["Read the Opposite Area", "The opposite area often shows what pulls or pressures the main issue."],
      ["Plain Examples", "Annual Wealth with friction means watch spending, debt, and contracts. Annual Career with authority means more responsibility at work."],
      ["How to Use It", "Use the annual cycle for timing. It tells you what to pay attention to now."]
    ],
    next: "how-to-read-zi-wei-dou-shu-chart.html"
  }
];

const byZh = new Map(articles.map((article) => [article.zh, article]));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

function slugUrl(slug) {
  return `${site}/articles/en/${slug}`;
}

function zhUrl(file) {
  return `${site}/articles/${file}`;
}

function articlePage(article) {
  const sectionHtml = article.sections.map(([heading, body], index) => `
        <h2 id="section-${index + 1}">${escapeHtml(heading)}</h2>
        <p>${escapeHtml(body)}</p>`).join("");

  const itemList = article.sections.map(([heading], index) => `
        <a href="#section-${index + 1}">${String(index + 1).padStart(2, "0")} ${escapeHtml(heading)}</a>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${escapeHtml(article.title)} | Learn Zi Wei Dou Shu</title>
  <meta name="description" content="${escapeHtml(article.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${slugUrl(article.slug)}">
  <link rel="alternate" hreflang="en" href="${slugUrl(article.slug)}">
  <link rel="alternate" hreflang="zh-CN" href="${zhUrl(article.zh)}">
  <link rel="alternate" hreflang="x-default" href="${slugUrl(article.slug)}">
  <meta property="og:title" content="${escapeHtml(article.title)}">
  <meta property="og:description" content="${escapeHtml(article.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${slugUrl(article.slug)}">
  <meta property="og:image" content="${site}/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260629-footer-legal-v1">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(article.title)},
    "description": ${JSON.stringify(article.description)},
    "image": "${site}/images/home2/triad-tian-bg.webp",
    "datePublished": "${today}",
    "dateModified": "${today}",
    "inLanguage": "en",
    "articleSection": ${JSON.stringify(article.category)},
    "about": ["Zi Wei Dou Shu", "Chinese astrology chart", ${JSON.stringify(article.title)}],
    "author": { "@type": "Organization", "name": "YuetianAI", "alternateName": "阅天AI" },
    "publisher": { "@type": "Organization", "name": "YuetianAI", "alternateName": "阅天AI" },
    "mainEntityOfPage": "${slugUrl(article.slug)}"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "YuetianAI", "item": "${site}/" },
      { "@type": "ListItem", "position": 2, "name": "Learn Zi Wei Dou Shu", "item": "${site}/articles/en/" },
      { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(article.title)}, "item": "${slugUrl(article.slug)}" }
    ]
  }
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">Learn Zi Wei</a><a href="../${article.zh}">中文</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>${escapeHtml(article.category)}</span></nav>
          <h1>${escapeHtml(article.title)}</h1>
          <p class="detail-subtitle">${escapeHtml(article.subtitle)}</p>
          <p class="article-meta"><span>${escapeHtml(article.category)}</span><span><time datetime="${today}">${today}</time></span></p>
        </div>
        <div class="article-orbit" aria-hidden="true"><span>Zi Wei</span><i>Self</i><i>Money</i><i>Work</i><i>World</i><i>Time</i></div>
      </div>
    </section>

    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${escapeHtml(article.lead)}</p>
        <p>For English readers, the key is to treat Zi Wei Dou Shu as a structured chart-reading method. Keep the traditional terms when they help search and recognition, but translate the idea into everyday language before making a judgment.</p>
        <hr>${sectionHtml}
      </article>

      <aside class="side-panel detail-rail" aria-label="Article navigation">
        <h2>Contents</h2>${itemList}
        <a href="../../pages/mingbook-onepage.html" class="rail-cta">Open Chart Tool</a>
        <small>Chinese version</small>
        <a href="../${article.zh}">中文阅读</a>
      </aside>
    </div>

    <div class="container article-bottom-link">
      <span>Use the chart as a clear thinking map, not a fear-based prediction.</span>
      <a href="${article.next}">Next article →</a>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 YuetianAI / 阅天AI. Powered By 阅天工作室</span></div></footer>
</body>
</html>`;
}

function indexPage() {
  const cards = articles.map((article, index) => `
          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${escapeHtml(article.category)}</span><span>Plain English</span></div>
              <h3>${escapeHtml(article.title)}</h3>
              <p>${escapeHtml(article.subtitle)}</p>
              <a class="card-link" href="${article.slug}">Read article</a>
            </div>
          </article>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>Learn Zi Wei Dou Shu in Plain English | YuetianAI</title>
  <meta name="description" content="Plain-English Zi Wei Dou Shu articles for English readers: Life Palace, Wealth Palace, Career Palace, Body Palace, triad reading, ten-year cycles, and annual timing.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${site}/articles/en/">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <link rel="alternate" hreflang="zh-CN" href="${site}/articles/">
  <link rel="alternate" hreflang="x-default" href="${site}/articles/en/">
  <link rel="alternate" type="application/rss+xml" title="YuetianAI English updates" href="${site}/articles/en/feed.xml">
  <meta property="og:title" content="Learn Zi Wei Dou Shu in Plain English">
  <meta property="og:description" content="A plain-English reading path for Zi Wei Dou Shu charts.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${site}/articles/en/">
  <meta property="og:image" content="${site}/images/home2/triad-tian-bg.webp">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260629-article-accordion-v1">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Learn Zi Wei Dou Shu in Plain English",
    "url": "${site}/articles/en/",
    "inLanguage": "en",
    "description": "Plain-English Zi Wei Dou Shu articles for English readers."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "YuetianAI English Zi Wei Dou Shu Articles",
    "itemListElement": [
${articles.map((article, index) => `      { "@type": "ListItem", "position": ${index + 1}, "url": "${slugUrl(article.slug)}", "name": ${JSON.stringify(article.title)} }`).join(",\n")}
    ]
  }
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="../">中文</a></nav>
    </div>
  </header>
  <main>
    <section class="hero">
      <div class="container">
        <p class="eyebrow">Plain-English Zi Wei Dou Shu</p>
        <h1>Learn Zi Wei Dou Shu without getting lost in jargon.</h1>
        <p>These articles keep the useful Chinese astrology keywords for search, then explain each idea in everyday English for readers who are new to the system.</p>
      </div>
    </section>
    <section class="series">
      <div class="container">
        <details class="article-group" open>
          <summary class="section-head">
            <h1>Zi Wei Dou Shu Reading Guide</h1>
            <span class="section-desc">Palaces, timing, and practical chart-reading order.</span>
            <span class="section-toggle"><span>${articles.length} Articles</span></span>
          </summary>
          <div class="article-list">${cards}
          </div>
        </details>
      </div>
    </section>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 YuetianAI / 阅天AI. Powered By 阅天工作室</span></div></footer>
</body>
</html>`;
}

function feedXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>YuetianAI English Updates</title>
    <link>${site}/articles/en/</link>
    <description>Plain-English Zi Wei Dou Shu articles and Chinese astrology chart reading guides.</description>
    <language>en</language>
    <lastBuildDate>Tue, 30 Jun 2026 16:00:00 +0800</lastBuildDate>
    <atom:link href="${site}/articles/en/feed.xml" rel="self" type="application/rss+xml" />
${articles.slice().reverse().map((article) => `
    <item>
      <title>${escapeHtml(article.title)}</title>
      <link>${slugUrl(article.slug)}</link>
      <guid isPermaLink="true">${slugUrl(article.slug)}</guid>
      <pubDate>Tue, 30 Jun 2026 16:00:00 +0800</pubDate>
      <description>${escapeHtml(article.description)}</description>
    </item>`).join("")}
  </channel>
</rss>`;
}

function sitemapXml() {
  const urls = [`${site}/articles/en/`, `${site}/articles/en/feed.xml`, ...articles.map((article) => slugUrl(article.slug))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url.endsWith("/articles/en/") ? "0.8" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>`;
}

function addHreflangToChinese(article) {
  const file = path.join(root, "articles", article.zh);
  let html = readFileSync(file, "utf8");
  html = html
    .replace(/\n\s*<link rel="alternate" hreflang="(?:zh-CN|en|x-default)" href="https:\/\/yuetianai\.com\/(?:articles\/en|en\/articles|articles)\/[^"]*">/g, "")
    .replace(/<a href="(?:\.\.\/en\/articles\/|en\/)[^"]+">English<\/a>/g, "");
  html = html.replace(/(<link rel="canonical" href="[^"]+">)/, `$1
  <link rel="alternate" hreflang="zh-CN" href="${zhUrl(article.zh)}">
  <link rel="alternate" hreflang="en" href="${slugUrl(article.slug)}">
  <link rel="alternate" hreflang="x-default" href="${slugUrl(article.slug)}">`);
  if (html.includes("<nav class=\"nav-links\"")) {
    html = html.replace(/(<nav class="nav-links"[^>]*>[\s\S]*?)(<\/nav>)/, (match, before, close) => {
      if (before.includes(">English<")) return match;
      return `${before}<a href="en/${article.slug}">English</a>${close}`;
    });
  }
  writeFileSync(file, html, "utf8");
}

function addIndexHreflang() {
  const file = path.join(root, "articles", "index.html");
  let html = readFileSync(file, "utf8");
  html = html
    .replace(/\n\s*<link rel="alternate" hreflang="(?:zh-CN|en|x-default)" href="https:\/\/yuetianai\.com\/(?:articles\/en\/?|en\/articles\/?|articles\/?)">/g, "")
    .replace(/<a href="(?:\.\.\/en\/articles\/|en\/)">English<\/a>/g, "");
  html = html.replace(/(<link rel="canonical" href="https:\/\/yuetianai\.com\/articles\/">)/, `$1
  <link rel="alternate" hreflang="zh-CN" href="${site}/articles/">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <link rel="alternate" hreflang="x-default" href="${site}/articles/en/">`);
  if (!html.includes('href="en/"')) {
    html = html.replace(/(<a href="\.\/" aria-current="page">学习紫微<\/a>)/, `$1
        <a href="en/">English</a>`);
  }
  html = html.replace(/(<a href="en\/">English<\/a>)\s+(<\/nav>)/, `$1
      $2`);
  writeFileSync(file, html, "utf8");
}

for (const article of articles) {
  writeFileSync(path.join(outDir, article.slug), articlePage(article), "utf8");
  addHreflangToChinese(article);
}

addIndexHreflang();
writeFileSync(path.join(outDir, "index.html"), indexPage(), "utf8");
writeFileSync(path.join(outDir, "feed.xml"), feedXml(), "utf8");
writeFileSync(path.join(root, "sitemap-en.xml"), sitemapXml(), "utf8");

console.log(`Generated ${articles.length} English articles.`);
