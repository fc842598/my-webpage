function paragraphs(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function bodyOf(article) {
  const opening = paragraphs(article.openingParagraphs).join("\n\n");
  const sections = paragraphs(article.sections).map((section) => {
    const heading = String(section?.heading || "").trim();
    const body = paragraphs(section?.paragraphs).join("\n\n");
    return [heading ? `### ${heading}` : "", body].filter(Boolean).join("\n");
  }).filter(Boolean).join("\n\n");
  const readingOrder = article.orderText
    ? `### 排盘使用顺序\n${article.orderText}`
    : "";
  return [opening, sections, readingOrder].filter(Boolean).join("\n\n");
}

function englishBodyOf(article) {
  const english = article.english || {};
  const opening = paragraphs(english.openingParagraphs).join("\n\n");
  const sections = paragraphs(english.sections).map((section) => {
    const heading = String(section?.heading || "").trim();
    const body = paragraphs(section?.paragraphs).join("\n\n");
    return [heading ? `### ${heading}` : "", body].filter(Boolean).join("\n");
  }).filter(Boolean).join("\n\n");
  const readingOrder = english.orderText
    ? `### Practical Reading Order\n${english.orderText}`
    : "";
  return [opening, sections, readingOrder].filter(Boolean).join("\n\n");
}

function optionalReference(article) {
  const reference = String(article.sourceReference || article.reference || "").trim();
  return reference ? `参考资料：${reference}\n` : "";
}

export function dailyArticleSourceText(date, articles) {
  const ordered = [...articles].sort((left, right) => left.order - right.order);
  const blocks = ordered.map((article) => `## ${article.order}. ${article.title}
slug：\`${article.slug}\`
搜索意图：${article.intent || "编辑选题"}
${optionalReference(article)}正文草稿：
${bodyOf(article)}

英文标题：${article.english?.title || ""}
英文描述：${article.english?.description || ""}
英文正文：
${englishBodyOf(article)}`);

  return `# 紫微文章源稿 ${date}

本批次共 ${ordered.length} 篇。同步文稿和站点数据均为可选参考，不作为发布凭证；编辑或用户直接提供的文章可以独立进入发布队列。

${blocks.join("\n\n---\n\n")}
`;
}
