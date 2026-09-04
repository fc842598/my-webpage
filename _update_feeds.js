const fs = require('fs');

function updateFeed(filePath, isEnglish) {
  let xml = fs.readFileSync(filePath, 'utf8');

  // Update lastBuildDate
  xml = xml.replace(
    /<lastBuildDate>[^<]+<\/lastBuildDate>/,
    '<lastBuildDate>Tue, 11 Aug 2026 02:15:00 +0000</lastBuildDate>'
  );

  // New items
  let newItems;
  if (isEnglish) {
    newItems = `    <item>
      <title>Life Palace With Hua Lu: Born With Resources, but That Doesn't Mean You Can Coast</title>
      <link>https://yuetianai.com/articles/en/ziwei-minggong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/en/ziwei-minggong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>Hua Lu in the Life Palace gives you natural warmth and easy opportunities. But the trap is complacency — resources arrive easily, and keeping them is a different skill.</description>
    </item>
    <item>
      <title>Children Palace With Hua Lu: Kids, Creations, and Passive Income Are Not the Same Thing</title>
      <link>https://yuetianai.com/articles/en/ziwei-zinvgong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/en/ziwei-zinvgong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>The Children Palace covers more than children. It also rules your creative work, students, and investments you don't manage day to day. Hua Lu here means returns on what you put out.</description>
    </item>
    <item>
      <title>Wealth Palace With Hua Lu: Earning Well and Keeping It Are Two Different Skills</title>
      <link>https://yuetianai.com/articles/en/ziwei-caibogong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/en/ziwei-caibogong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>Hua Lu in the Wealth Palace means earning opportunities come easily. But money arriving and money staying are different matters. You need the Property and Mental palaces too.</description>
    </item>
    <item>
      <title>Health Palace With Hua Lu: A Strong Body and a Calm Mind Are Not the Same Thing</title>
      <link>https://yuetianai.com/articles/en/ziwei-jieegong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/en/ziwei-jieegong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>Hua Lu in the Health Palace means fast recovery and an easygoing nature. But it also makes you ignore warning signs. Read the body line and the mind line separately.</description>
    </item>
    <item>
      <title>Friends Palace With Hua Lu: Knowing Everyone and Having Real Allies Are Different</title>
      <link>https://yuetianai.com/articles/en/ziwei-jiaoyougong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/en/ziwei-jiaoyougong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>Hua Lu in the Friends Palace gives you a wide social circle. But a big network is not the same as a deep one. Read it against the Brothers Palace to see the full picture.</description>
    </item>
`;
  } else {
    newItems = `    <item>
      <title>紫微斗数命宫化禄：天生带资源，为什么不等于不用努力</title>
      <link>https://yuetianai.com/articles/ziwei-minggong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/ziwei-minggong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>命宫化禄的人自带亲和力，机会好像总往身上靠。但禄在命宫最大的陷阱是容易满足——资源来得不费劲，守不守得住是另一回事。</description>
    </item>
    <item>
      <title>紫微斗数子女宫化禄：子女缘、作品和延伸财怎么分</title>
      <link>https://yuetianai.com/articles/ziwei-zinvgong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/ziwei-zinvgong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>子女宫化禄不只是孩子有出息。子女宫还看作品、学生、合伙投资的下游。化禄在这里，代表你延伸出去的东西容易有回报，但三条线要分开读。</description>
    </item>
    <item>
      <title>紫微斗数财帛宫化禄：会赚钱和留得住钱是两回事</title>
      <link>https://yuetianai.com/articles/ziwei-caibogong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/ziwei-caibogong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>财帛宫化禄的人通常不缺赚钱机会，但禄在财帛最大的问题是来的容易去的也快。能不能留住，要看田宅和福德，不能只看一个宫。</description>
    </item>
    <item>
      <title>紫微斗数疾厄宫化禄：身体好和心情好哪个更重要</title>
      <link>https://yuetianai.com/articles/ziwei-jieegong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/ziwei-jieegong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>疾厄宫化禄不只是身体少病。疾厄宫看身体也看情绪，化禄在这里的人通常心大、恢复力强，但心大不等于没有隐患，要和父母宫对看。</description>
    </item>
    <item>
      <title>紫微斗数交友宫化禄：朋友多和贵人在外不是一回事</title>
      <link>https://yuetianai.com/articles/ziwei-jiaoyougong-hualu.html</link>
      <guid isPermaLink="true">https://yuetianai.com/articles/ziwei-jiaoyougong-hualu.html</guid>
      <pubDate>Tue, 11 Aug 2026 02:15:00 +0000</pubDate>
      <description>交友宫化禄的人社交圈广，但朋友多不等于贵人多。交友宫看的是众生缘和下属缘，化禄在这里要分清热闹和有用，还要和兄弟宫对看。</description>
    </item>
`;
  }

  // Insert new items after the atom:link line (before first <item>)
  const firstItemIdx = xml.indexOf('    <item>');
  xml = xml.slice(0, firstItemIdx) + newItems + xml.slice(firstItemIdx);

  // Count items and remove last 5 to keep 80
  const itemRegex = /    <item>[\s\S]*?    <\/item>\n/g;
  const items = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }
  console.log(`${filePath}: ${items.length} items total`);

  if (items.length > 80) {
    // Remove last (items.length - 80) items
    const toRemove = items.length - 80;
    const removeStart = items[items.length - toRemove].start;
    const removeEnd = items[items.length - 1].end;
    xml = xml.slice(0, removeStart) + xml.slice(removeEnd);
    console.log(`Removed ${toRemove} oldest items`);
  }

  // Ensure no trailing blank line issues
  xml = xml.trimEnd() + '\n';
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`Feed updated: ${filePath}`);
}

updateFeed('C:/Users/1/Desktop/doubao-work/feed.xml', false);
updateFeed('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', true);
