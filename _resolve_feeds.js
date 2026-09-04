const fs = require('fs');

// Resolve feed.xml
function resolveFeed(filePath, isEnglish) {
  // Read the remote version (HEAD side during rebase)
  const { execSync } = require('child_process');
  const relPath = filePath.replace(/\\/g, '/').replace('C:/Users/1/Desktop/doubao-work/', '');
  let remoteContent;
  try {
    remoteContent = execSync(`git show HEAD:${relPath}`, {
      cwd: 'C:/Users/1/Desktop/doubao-work',
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
  } catch (e) {
    console.log(`Could not get remote version of ${filePath}: ${e.message}`);
    return;
  }

  // My 5 new items to insert (after the remote's new items)
  let myItems;
  if (isEnglish) {
    myItems = `    <item>
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
    myItems = `    <item>
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

  // The remote already has 3 new items at the top. Insert my 5 items after those 3.
  // Find the 4th <item> in the remote (which is the huotan article, the first old one)
  const itemPositions = [];
  const itemRegex = /<item>/g;
  let match;
  while ((match = itemRegex.exec(remoteContent)) !== null) {
    itemPositions.push(match.index);
  }
  console.log(`${filePath}: remote has ${itemPositions.length} items`);

  // Insert my items before the 4th item (index 3, which is the 4th item)
  const insertPos = itemPositions[3];
  let resolved = remoteContent.slice(0, insertPos) + myItems + remoteContent.slice(insertPos);

  // Now trim to 80 items
  const allItems = [];
  const regex2 = /<item>[\s\S]*?<\/item>/g;
  while ((match = regex2.exec(resolved)) !== null) {
    allItems.push({ start: match.index, end: match.index + match[0].length });
  }
  console.log(`${filePath}: after merge has ${allItems.length} items`);

  if (allItems.length > 80) {
    const toRemove = allItems.length - 80;
    const removeStart = allItems[allItems.length - toRemove].start;
    let actualStart = removeStart;
    while (actualStart > 0 && (resolved[actualStart - 1] === ' ' || resolved[actualStart - 1] === '\n' || resolved[actualStart - 1] === '\r' || resolved[actualStart - 1] === '\t')) {
      actualStart--;
    }
    actualStart++;
    resolved = resolved.slice(0, actualStart) + resolved.slice(allItems[allItems.length - 1].end);
  }

  resolved = resolved.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Remove trailing whitespace from each line
  resolved = resolved.split('\n').map(l => l.trimEnd()).join('\n');
  resolved = resolved.trimEnd() + '\n';

  fs.writeFileSync(filePath, resolved, 'utf8');
  console.log(`${filePath}: resolved and written`);
}

resolveFeed('C:/Users/1/Desktop/doubao-work/feed.xml', false);
resolveFeed('C:/Users/1/Desktop/doubao-work/articles/en/feed.xml', true);
