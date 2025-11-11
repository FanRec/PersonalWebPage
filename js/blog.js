function themeColorSet() {}
function articlesInit() {
  const ARTICLE_DATA_URL = "../json/articles/articles.json";

  // 文章卡片生成
  const articleListContainer = document.querySelector(".main-article-list");
  // 侧边栏信息生成
  const categoryListContainer = document.querySelector(".category-list");
  const tagCloudContainer = document.querySelector(".tag-cloud");
  // 文章搜索过滤
  const searchInput = document.getElementById("search-input");

  if (!categoryListContainer || !tagCloudContainer) {
    console.error("未找到 .category-list 或 .tag-cloud 容器");
  }
  // 存储原始文章数据对象
  let allArticlesData = [];
  let allArticleCards = [];
  if (!articleListContainer) {
    console.error("未找到 .main-article-list 容器");
    return;
  }

  const dateIconPath =
    "M917.333333 426.666667H106.666667v469.333333l477.738666 0.021334L917.333333 895.957333V426.666667z m0-64V170.666667C917.333333 170.666667 746.666667 170.666667 746.666667 170.666667V106.666667h170.666666A64 64 0 0 1 981.333333 170.666667v725.333333A64 64 0 0 1 917.333333 960H106.666667A64 64 0 0 1 42.666667 896V170.666667C42.666667 137.408 70.330667 106.666667 106.666667 106.666667H256v64l-149.333333 0.042667V362.666667h810.666666zM277.333333 64h64v213.333333h-64V64z m384 0h64v213.333333h-64V64zM362.666667 106.666667h341.333333v64H362.666667V106.666667z";
  const categoryIconPath1 =
    "M917.333333 0v774.592H247.082667c-42.218667 0-76.693333 32.149333-79.018667 71.637333l-0.149333 4.266667v35.626667c0 40 33.066667 73.557333 74.666666 75.818666l4.501334 0.128H917.333333V1024H247.082667C171.818667 1024 109.610667 965.12 106.773333 891.413333L106.666667 886.122667V173.504C106.666667 79.701333 183.253333 3.2 277.717333 0.106667L283.690667 0H917.333333z m-64 65.365333H285.504c-61.568 0-111.936 47.786667-114.709333 106.602667L170.666667 177.024 170.666667 740.757333l1.386666-0.917333a139.328 139.328 0 0 1 71.829334-23.104l5.333333-0.085333L853.333333 716.586667V65.365333z";
  const categoryIconPath2 =
    "M298.666667 43.584v718.976H234.666667V43.584h64zM917.333333 849.706667v65.365333H234.666667V849.706667h682.666666z";
  const tagIconPath1 =
    "M128 341.333333m42.666667 0l682.666666 0q42.666667 0 42.666667 42.666667l0 0q0 42.666667-42.666667 42.666667l-682.666666 0q-42.666667 0-42.666667-42.666667l0 0q0-42.666667 42.666667-42.666667Z";
  const tagIconPath2 =
    "M422.613333 85.333333H426.666667a38.613333 38.613333 0 0 1 38.4 42.453334L387.84 900.266667a42.666667 42.666667 0 0 1-42.453333 38.4H341.333333a38.613333 38.613333 0 0 1-38.4-42.453334L380.16 123.733333a42.666667 42.666667 0 0 1 42.453333-38.4zM678.613333 85.333333H682.666667a38.613333 38.613333 0 0 1 38.4 42.453334L643.84 900.266667a42.666667 42.666667 0 0 1-42.453333 38.4H597.333333a38.613333 38.613333 0 0 1-38.4-42.453334L636.16 123.733333a42.666667 42.666667 0 0 1 42.453333-38.4z";
  const tagIconPath3 =
    "M128 597.333333m42.666667 0l682.666666 0q42.666667 0 42.666667 42.666667l0 0q0 42.666667-42.666667 42.666667l-682.666666 0q-42.666667 0-42.666667-42.666667l0 0q0-42.666667 42.666667-42.666667Z";

  /**
   * 创建 SVG 图标
   * @param {string} pId1 - 第一个 path 的 d 属性值
   * @param {string} [pId2] - 第二个 path 的 d 属性值
   * @param {string} [pId3] - 第三个 path 的 d 属性值
   * @param {string} [fill1='#ffffff'] - 第一个 path 的 fill 颜色
   * @param {string} [fill2='#111111'] - 第二个 path 的 fill 颜色
   * @param {string} [fill3='#ffffff'] - 第三个 path 的 fill 颜色
   * @returns {SVGElement} - 生成的 SVG 元素
   */
  function createSvgIcon(
    pId1,
    pId2,
    pId3,
    fill1 = "#ffffff",
    fill2 = "#ffffff",
    fill3 = "#ffffff"
  ) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("viewBox", "0 0 1024 1024");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute("d", pId1);
    path1.setAttribute("fill", fill1);

    svg.appendChild(path1);

    if (pId2) {
      const path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path2.setAttribute("d", pId2);
      path2.setAttribute("fill", fill2);
      svg.appendChild(path2);
    }

    if (pId3) {
      const path3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path3.setAttribute("d", pId3);
      path3.setAttribute("fill", fill3);
      svg.appendChild(path3);
    }

    return svg;
  }

  /* 生成卡片 */
  function createArticleCard(moduleData) {
    const card = document.createElement("a");
    card.setAttribute("href", `./articles/article.html#${moduleData.name}`);
    card.setAttribute("target", "_blank");
    card.setAttribute("data-category", moduleData.category || "未分类");
    card.setAttribute("data-tags", (moduleData.tag || "").toLowerCase());
    card.classList.add("article-card", "flag", "filterable");

    const cardInfo = document.createElement("div");
    cardInfo.setAttribute("class", "card-info");

    const articleTitle = document.createElement("h2");
    articleTitle.setAttribute("class", "article-title");
    articleTitle.textContent = moduleData.title;

    const articleMeta = document.createElement("div");
    articleMeta.setAttribute("class", "article-meta");

    // 日期
    articleMeta.appendChild(createSvgIcon(dateIconPath, null, null, "#ffffff"));
    const dateSpan = document.createElement("span");
    dateSpan.textContent = moduleData.date || "xxxx-xx-xx";
    articleMeta.appendChild(dateSpan);

    // 分类
    articleMeta.appendChild(
      createSvgIcon(
        categoryIconPath1,
        categoryIconPath2,
        null,
        "#111111",
        "#111111"
      )
    );
    const categorySpan = document.createElement("span");
    categorySpan.textContent = `# ${moduleData.category || "未分类"}`;
    articleMeta.appendChild(categorySpan);

    // 标签
    articleMeta.appendChild(
      createSvgIcon(
        tagIconPath1,
        tagIconPath2,
        tagIconPath3,
        "#ffffff",
        "#ffffff",
        "#ffffff"
      )
    );
    const tagsSpan = document.createElement("span");
    tagsSpan.setAttribute("class", "tags");

    const tags = moduleData.tag ? moduleData.tag.split("/") : [];
    tags.forEach((tag, index) => {
      const tagItemSpan = document.createElement("span");
      tagItemSpan.textContent = tag.trim();
      tagsSpan.appendChild(tagItemSpan);

      if (index < tags.length - 1) {
        const separatorSpan = document.createElement("span");
        separatorSpan.textContent = "/";
        tagsSpan.appendChild(separatorSpan);
      }
    });
    articleMeta.appendChild(tagsSpan);

    // 文章摘要
    const summary = document.createElement("p");
    summary.setAttribute("class", "article-summary");
    summary.textContent = `${
      moduleData.summary || `了解更多关于 ${moduleData.title} 的信息...`
    }`;

    // 文章统计
    const articleStats = document.createElement("div");
    articleStats.setAttribute("class", "article-stats");
    articleStats.innerHTML = `<span>${
      moduleData.words || "xxx"
    } words</span> <span>|</span> <span>${
      moduleData.readingTime || "x"
    } minutes</span>`;

    const cardArrow = document.createElement("div");
    cardArrow.setAttribute("class", "card-arrow");
    cardArrow.textContent = ">";

    cardInfo.appendChild(articleTitle);
    cardInfo.appendChild(articleMeta);
    cardInfo.appendChild(summary);
    cardInfo.appendChild(articleStats);

    card.appendChild(cardInfo);
    card.appendChild(cardArrow);

    return card;
  }
  /* 填充侧边栏(分类和标签) */
  function populateSidebar(categoryCounts, uniqueTags) {
    if (!categoryListContainer || !tagCloudContainer) return;

    function setActive(element) {
      const parent = element.parentElement;
      parent.querySelectorAll("li, a").forEach((el) => {
        el.classList.remove("active-filter");
      });
      element.classList.add("active-filter");
    }

    categoryListContainer.innerHTML = "";
    const totalArticlesCount = allArticleCards.length;

    const allLi = document.createElement("li");
    allLi.innerHTML = `
        <span>ALL</span>
        <span class="badge">${totalArticlesCount}</span>
        `;
    allLi.classList.add("active-filter");
    allLi.addEventListener("click", (e) => {
      displayAllArticles();
      setActive(e.currentTarget);
    });
    categoryListContainer.appendChild(allLi);

    for (const category in categoryCounts) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${category}</span>
        <span class="badge">${categoryCounts[category]}</span>
        `;
      li.addEventListener("click", (e) => {
        filterArticlesByCategory(category);
        setActive(e.currentTarget);
        tagCloudContainer
          .querySelectorAll("a")
          .forEach((a) => a.classList.remove("active-filter"));
      });
      categoryListContainer.appendChild(li);
    }

    tagCloudContainer.innerHTML = "";
    uniqueTags.forEach((tag) => {
      const a = document.createElement("a");
      a.setAttribute("href", `#`);
      a.textContent = tag;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        filterArticlesByTag(tag);
        setActive(e.currentTarget);
        categoryListContainer
          .querySelectorAll("li")
          .forEach((li) => li.classList.remove("active-filter"));
      });
      tagCloudContainer.appendChild(a);
    });
  }
  /**
   * 显示所有文章卡片
   */
  function displayAllArticles() {
    allArticleCards.forEach((card) => {
      card.style.display = "flex";
    });
    history.pushState(null, "", location.pathname);
  }

  /**
   * 根据分类筛选文章
   */
  function filterArticlesByCategory(category) {
    const filter = category.trim();

    allArticleCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (cardCategory === filter) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
    history.pushState(null, "", `?category=${encodeURIComponent(filter)}`);
  }

  /**
   * 根据标签筛选文章
   */
  function filterArticlesByTag(tag) {
    const filter = tag.trim().toLowerCase();

    allArticleCards.forEach((card) => {
      const cardTags = card.getAttribute("data-tags");
      if (
        cardTags &&
        cardTags
          .split("/")
          .map((t) => t.trim())
          .includes(filter)
      ) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });

    history.pushState(null, "", `?tag=${encodeURIComponent(filter)}`);
  }
  /**
   * 根据关键词筛选文章
   */
  function filterArticlesBySearch(query) {
    const filterQuery = query.trim().toLowerCase();

    if (filterQuery === "") {
      allArticleCards.forEach((card) => (card.style.display = "flex"));
      return;
    }

    console.log(`按搜索关键词筛选: ${filterQuery}`);

    allArticleCards.forEach((card) => {
      const title =
        card.querySelector(".article-title")?.textContent.toLowerCase() || "";
      const summary =
        card.querySelector(".article-summary")?.textContent.toLowerCase() || "";

      const category = card.getAttribute("data-category")?.toLowerCase() || "";
      const tags = card.getAttribute("data-tags") || "";

      if (
        title.includes(filterQuery) ||
        summary.includes(filterQuery) ||
        category.includes(filterQuery) ||
        tags.includes(filterQuery)
      ) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }
  function setupEventListeners() {
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        filterArticlesBySearch(e.target.value);
      });
    }
  }
  // 加载文章数据并生成卡片
  async function loadArticles() {
    try {
      const response = await fetch(ARTICLE_DATA_URL);

      if (!response.ok) {
        throw new Error(`ERROR:状态码: ${response.status}`);
      }

      const articleModules = await response.json();
      articleListContainer.innerHTML = "";

      const categoryCounts = {};
      const uniqueTags = new Set();

      allArticlesData = [];
      allArticleCards = [];

      articleModules.forEach((moduleObj) => {
        const moduleKey = Object.keys(moduleObj)[0];
        const moduleData = moduleObj[moduleKey];

        allArticlesData.push(moduleData);

        const newCard = createArticleCard(moduleData);
        articleListContainer.appendChild(newCard);

        allArticleCards.push(newCard);
        // 统计分类和标签
        const category = moduleData.category || "未分类";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        if (moduleData.tag) {
          const tags = moduleData.tag.split("/").map((t) => t.trim());
          tags.forEach((tag) => uniqueTags.add(tag));
        }
      });
      // 填充侧边栏
      if (categoryListContainer && tagCloudContainer) {
        populateSidebar(categoryCounts, uniqueTags);
      }
      /* 滚动显示 */
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        });
      });
      const hiddenElements = document.querySelectorAll(".flag");
      hiddenElements.forEach((el) => observer.observe(el));

      displayAllArticles();
      setupEventListeners();
    } catch (error) {
      console.error("加载文章数据失败:", error);
      articleListContainer.innerHTML =
        '<p style="color: red;">抱歉，文章列表加载失败。</p>';
    }
  }

  loadArticles();
}
document.addEventListener("DOMContentLoaded", () => {
  articlesInit();
});
