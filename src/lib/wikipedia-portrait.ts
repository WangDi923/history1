// 提取的 Wikipedia 肖像获取逻辑，可在服务器端直接使用

type WikiPage = {
  title?: string;
  thumbnail?: { source?: string };
  original?: { source?: string };
  extract?: string;
};

type SearchResult = {
  title?: string;
  pageid?: number;
};

function pickImageFromPages(pages: Record<string, WikiPage>): {
  imageUrl: string | null;
  title?: string;
} {
  for (const key of Object.keys(pages)) {
    const page = pages[key];
    const imageUrl = page?.original?.source || page?.thumbnail?.source;
    if (imageUrl) {
      return {
        imageUrl,
        title: page?.title,
      };
    }
  }
  return { imageUrl: null };
}

async function searchAndFetchPortrait(figureName: string, language: "zh" | "en") {
  const encoded = encodeURIComponent(figureName);
  const domain = language === "zh" ? "zh.wikipedia.org" : "en.wikipedia.org";

  // 第一步：搜索找到匹配页面
  const searchUrl =
    `https://${domain}/w/api.php?action=query&format=json&origin=*` +
    `&list=search&srsearch=${encoded}&srlimit=5&srnamespace=0`;

  const searchRes = await fetch(searchUrl, { cache: "no-store" });
  if (!searchRes.ok) {
    return { imageUrl: null, matchedTitle: figureName };
  }

  const searchData = (await searchRes.json()) as {
    query?: { search?: SearchResult[] };
  };
  const searchResults = searchData.query?.search ?? [];

  if (searchResults.length === 0) {
    return { imageUrl: null, matchedTitle: figureName };
  }

  // 第二步：对前3个搜索结果逐个取图
  for (const result of searchResults.slice(0, 3)) {
    const pageTitle = result.title;
    if (!pageTitle) continue;

    const imageUrl = encodeURIComponent(pageTitle);
    const infoUrl =
      `https://${domain}/w/api.php?action=query&format=json&origin=*` +
      `&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=800` +
      `&exintro=1&explaintext=1&titles=${imageUrl}`;

    const infoRes = await fetch(infoUrl, { cache: "no-store" });
    if (!infoRes.ok) continue;

    const infoData = (await infoRes.json()) as {
      query?: { pages?: Record<string, WikiPage> };
    };
    const pages = infoData.query?.pages ?? {};
    const picked = pickImageFromPages(pages);

    if (picked.imageUrl) {
      return {
        imageUrl: picked.imageUrl,
        matchedTitle: picked.title ?? pageTitle ?? figureName,
      };
    }
  }

  return { imageUrl: null, matchedTitle: figureName };
}

export async function fetchPortraitFromWiki(figureName: string) {
  // 1) 优先中文维基
  const zhResult = await searchAndFetchPortrait(figureName, "zh");
  if (zhResult.imageUrl) {
    return {
      imageUrl: zhResult.imageUrl,
      matchedTitle: zhResult.matchedTitle,
      source: "wikipedia-zh",
    };
  }

  // 2) 回退英文维基
  const enResult = await searchAndFetchPortrait(figureName, "en");
  if (enResult.imageUrl) {
    return {
      imageUrl: enResult.imageUrl,
      matchedTitle: enResult.matchedTitle,
      source: "wikipedia-en",
    };
  }

  return {
    imageUrl: null,
    matchedTitle: figureName,
    source: null,
  };
}
