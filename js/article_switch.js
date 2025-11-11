document.addEventListener("DOMContentLoaded", () => {
  // 静态元素
  const body = document.body;
  const tocContainer = document.getElementById("toc-container");
  const articleContentContainer = document.getElementById("article-content"); // 核心内容注入点
  const rightbar = document.getElementById("rightbar");
  const right_toggleBtn = document.getElementById("right-toggleBtn");

  // 文章元数据 UI 元素
  const headerTitle = document.getElementById("article-title-header");
  const mainTitle = document.getElementById("main-article-title");
  const bannerBgCover = document.getElementById("banner-bg-cover");
  const bannerTitleText = document.getElementById("banner-title-text");
  const bannerIcon = document.getElementById("banner-icon");
  const documentTitle = document;

  let ARTICLE_METADATA = {}; // 存储 metadata.json 数据
  let FULL_TOC_DATA = []; // 【新增】存储 articles.json 完整数据
  let STATIC = "../../static/";

  // 静态UI逻辑
  function initializeStaticUI() {
    // ... (侧边栏折叠展开代码不变) ...
    const left_toggleBtn = document.getElementById("left-toggleBtn");
    const top_toggleBtn = document.getElementById("top-toggleBtn");
    if (left_toggleBtn && top_toggleBtn) {
      window.keepExpanded = true;
      const setLeftCollapsed = (collapsed) => {
        if (collapsed) {
          body.classList.add("collapsed");
          left_toggleBtn.setAttribute("aria-expanded", "false");
          window.keepExpanded = false;
        } else {
          body.classList.remove("collapsed");
          left_toggleBtn.setAttribute("aria-expanded", "true");
          window.keepExpanded = true;
        }
      };
      left_toggleBtn.addEventListener("click", () => {
        setLeftCollapsed(!body.classList.contains("collapsed"));
        top_toggleBtn.classList.remove("hide");
      });
      top_toggleBtn.addEventListener("click", () => {
        setLeftCollapsed(!body.classList.contains("collapsed"));
        top_toggleBtn.classList.add("hide");
      });
      const adaptLeftbar = () => {
        if (
          window.matchMedia &&
          window.matchMedia("(max-width:900px)").matches
        ) {
          setLeftCollapsed(true);
          if (top_toggleBtn.classList.contains("hide"))
            top_toggleBtn.classList.remove("hide");
        } else {
          if (window.keepExpanded) {
            setLeftCollapsed(false);
            if (!top_toggleBtn.classList.contains("hide"))
              top_toggleBtn.classList.add("hide");
          }
        }
      };
      window.addEventListener("resize", adaptLeftbar);
      adaptLeftbar();
      function setRightCollapsed(collapsed) {
        if (collapsed) {
          rightbar.classList.add("collapsed");
          right_toggleBtn.setAttribute("aria-expanded", "false");
        } else {
          rightbar.classList.remove("collapsed");
          right_toggleBtn.setAttribute("aria-expanded", "true");
        }
      }
      right_toggleBtn.addEventListener("click", () => {
        setRightCollapsed(!rightbar.classList.contains("collapsed"));
      });

      function adaptRightbar() {
        if (
          window.matchMedia &&
          window.matchMedia("(max-width:768px)").matches
        ) {
          setRightCollapsed(true);
        } else setRightCollapsed(false);
      }
      adaptRightbar();
      window.addEventListener("resize", adaptRightbar);
    }

    // 弹窗系统
    const showMenuPopup = document.getElementById("popMenuBtn");
    const popupContainer = document.querySelector(".popup-container");
    const closeBtn = document.querySelector(".pop-close-btn");
    const popupBoxs = popupContainer ? popupContainer.children : [];
    if (showMenuPopup && popupContainer && closeBtn) {
      const showPopupBase = () => {
        popupContainer.classList.add("active");
        if (!body.classList.contains("popup-open"))
          body.classList.add("popup-open");
      };
      closeBtn.onclick = () => {
        popupContainer.classList.remove("active");
        if (body.classList.contains("popup-open"))
          body.classList.remove("popup-open");
        Array.from(popupBoxs).forEach((box) => {
          if (!box.classList.contains("hide")) box.classList.add("hide");
        });
      };
      showMenuPopup.onclick = () => {
        showPopupBase();
        const menuBox = popupContainer.querySelector(".menu-popup-box");
        if (menuBox && menuBox.classList.contains("hide"))
          menuBox.classList.remove("hide");
      };
    }
    // 日夜模式
    const day_night_toggleBtn = document.getElementById("day_night_checkbox");
    if (day_night_toggleBtn) {
      day_night_toggleBtn.addEventListener("change", () => {
        if (
          day_night_toggleBtn.checked &&
          !body.classList.contains("night-mode")
        ) {
          body.classList.add("night-mode");
        } else if (body.classList.contains("night-mode")) {
          body.classList.remove("night-mode");
        }
      });
    }
  }

  // 动态文章逻辑 (每次加载新文章后运行)
  function initializeArticleSpecificJS() {
    const rightbar = document.getElementById("rightbar");
    const dic = document.getElementById("dictionary");
    const right_toggleBtn = document.getElementById("right-toggleBtn");

    if (!rightbar || !dic || !right_toggleBtn) return;

    dic.innerHTML = ""; // 清空旧目录

    const headings = Array.from(
      articleContentContainer.querySelectorAll("h2, h3")
    ).map((h, i) => {
      if (!h.id) h.id = `content-auto-${i}`;
      return h;
    });

    const idToLink = {};

    headings.forEach((h) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + h.id;
      if (h.tagName.toLowerCase() === "h3") a.classList.add("h3");
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = h.textContent.trim();
      a.appendChild(label);
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const targetElement = document.getElementById(h.id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          // 获取当前 hash，解码，并去掉开头的 '#'
          const currentHash = decodeURIComponent(
            window.location.hash.substring(1)
          );

          // 将 hash 按文章锚点（#）分割，只取第一部分（即 模块名/文章路径）
          const baseHash = currentHash.split("#")[0];

          // 构造新的、完整的 hash，必须以 '#' 开头
          const newHash = `#${baseHash}#${h.id}`;

          // 使用 pushState 更新 URL，这不会触发 hashchange 路由
          history.pushState(null, null, newHash);
        }
        if (
          window.matchMedia &&
          window.matchMedia("(max-width:768px)").matches
        ) {
          rightbar.classList.add("collapsed");
          right_toggleBtn.setAttribute("aria-expanded", "false");
        }
      });
      li.appendChild(a);
      dic.appendChild(li);
      idToLink[h.id] = a;
    });

    function setActiveById(id) {
      if (!id) return;
      Object.values(idToLink).forEach((l) => l.classList.remove("active"));
      const link = idToLink[id];
      if (link) link.classList.add("active");
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    }

    function updateActive() {
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      let activeId = null;
      //收集视窗内的可见标题
      const visible = [];

      for (const h of headings) {
        const r = h.getBoundingClientRect();
        if (r.top < viewportHeight && r.bottom > 0) {
          visible.push({ el: h, top: r.top });
        }
      }
      if (visible.length > 0) {
        //可见标题中选择距离顶部最近的
        const offset = 80;
        let best = visible[0];
        let bestScore = Math.abs(visible[0].top - offset);
        for (let i = 1; i < visible.length; i++) {
          const v = visible[i];
          const score = Math.abs(v.top - offset);
          if (score < bestScore) {
            best = v;
            bestScore = score;
          }
        }
        activeId = best.el.id;
        setActiveById(activeId);
      } else {
        //若视窗内没有可见标题，选择最近在视口上方的标题
        let above = null;
        for (const h of headings) {
          const r = h.getBoundingClientRect();
          if (r.top < 0) {
            above = h;
          } else {
            break;
          }
        }
        if (above) {
          activeId = above.id;
          setActiveById(above.id);
        } else {
          //如果都在视口下方，高亮第一个\
          activeId = headings[0] ? headings[0].id : null;
          if (activeId) setActiveById(activeId);
        }
      }
      // 更新 URL Hash
      if (activeId) {
        let fullHash = window.location.hash;
        let baseHash = fullHash.includes("#")
          ? fullHash.substring(0, fullHash.lastIndexOf("#"))
          : fullHash;

        if (!baseHash || baseHash === "#") {
          return;
        }

        const newHash = `${baseHash}#${activeId}`;

        if (newHash !== fullHash) {
          history.replaceState(null, null, newHash);
        }
      }
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // 初始化时使用完整的 hash
    const initialHash = location.hash.split("#").slice(2).join("#");
    if (initialHash) {
      const el = document.getElementById(initialHash);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          60
        );
      }
    }
  }
  /* 模块内文章上下切换功能 */
  // 递归 扁平化文章列表
  function flattenToc(items, pathList) {
    items.forEach((item) => {
      if (item.type === "file") {
        pathList.push(item.path);
      } else if (item.type === "folder" && item.children) {
        flattenToc(item.children, pathList);
      }
    });
  }
  //获取当前模块的文章列表
  function getMouleArticleListByName(moduleName) {
    const targetModulWeapper = FULL_TOC_DATA.find((moduleWrapper) => {
      const module = Object.values(moduleWrapper)[0];
      return module && module.name === moduleName;
    });
    if (!targetModulWeapper) {
      return []; //找不到模块
    }
    const module = Object.values(targetModulWeapper)[0];
    const moduleArticles = [];
    //递归获取扁平化的目标模块文章列表
    flattenToc(module.articles, moduleArticles);
    return moduleArticles;
  }
  function updateChapterSwitcher(currentPath, moduleName) {
    const preBtn = document.getElementById("pre-chapter");
    const nextBtn = document.getElementById("next-chapter");

    if (!preBtn || !nextBtn) return;
    const currentModuleArticles = getMouleArticleListByName(moduleName);
    if (currentModuleArticles.length === 0) {
      console.error(`无法找到模块${moduleName}的文章列表`);
      preBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    const currentIndex = currentModuleArticles.indexOf(currentPath);
    //查找上下文路径
    const prePath = currentModuleArticles[currentIndex - 1];
    const nextPath = currentModuleArticles[currentIndex + 1];

    //构造哈希所需信息
    const currentHash = window.location.hash.substring(1);
    if (prePath) {
      const mateData = ARTICLE_METADATA[prePath];
      const title = mateData ? mateData.title : "上一章";
      const newHash = `#${moduleName}/${prePath}`;

      preBtn.querySelector("h1").textContent = "上一章";
      preBtn.querySelector("h3").textContent = title;
      preBtn.onclick = () => {
        window.location.hash = newHash;
      };
      preBtn.disabled = false;
    } else {
      preBtn.querySelector("h1").textContent = "上一章";
      preBtn.querySelector("h3").textContent = "已经到顶了";
      preBtn.onclick = null;
      preBtn.disabled = true;
    }
    if (nextPath) {
      const mateData = ARTICLE_METADATA[nextPath];
      const title = mateData ? mateData.title : "下一章";
      const newHash = `#${moduleName}/${nextPath}`;

      nextBtn.querySelector("h1").textContent = "下一章";
      nextBtn.querySelector("h3").textContent = title;
      nextBtn.onclick = () => {
        window.location.hash = newHash;
      };
      nextBtn.disabled = false;
    } else {
      nextBtn.querySelector("h1").textContent = "下一章";
      nextBtn.querySelector("h3").textContent = "已经到底了";
      nextBtn.onclick = null;
      nextBtn.disabled = true;
    }
  }
  // SPA 路由和动态TOC逻辑
  // 递归：构建文件和文件夹
  function buildTocItems(items, parentElement) {
    items.forEach((item) => {
      const li = document.createElement("li");
      if (item.type === "file") {
        const a = document.createElement("a");
        a.className = "toc-item toc-file";
        // 【注意】这里只存储文章路径，模块名在 handleRouteChange 中处理
        a.dataset.path = item.path;

        // 【修复】点击链接时不刷新，而是通过 JS 导航
        a.href = "javascript:void(0)";
        a.addEventListener("click", () => {
          const currentHash = window.location.hash.substring(1);
          const moduleName = currentHash.split("/")[0];
          window.location.hash = `#${moduleName}/${item.path}`;
        });

        const metadata = ARTICLE_METADATA[item.path] || { icon: "?" };

        const iconSpan = document.createElement("span");
        iconSpan.className = "icon";
        iconSpan.textContent = metadata.icon;

        const labelSpan = document.createElement("span");
        labelSpan.className = "label";
        labelSpan.textContent = item.name;

        a.appendChild(iconSpan);
        a.appendChild(labelSpan);
        li.appendChild(a);
      } else if (item.type === "folder") {
        const div = document.createElement("div");
        div.className = "toc-item toc-folder";

        const iconSpan = document.createElement("span");
        iconSpan.className = "icon";
        iconSpan.textContent = "📁";

        const labelSpan = document.createElement("span");
        labelSpan.className = "label";
        labelSpan.textContent = item.name;

        div.appendChild(iconSpan);
        div.appendChild(labelSpan);
        li.appendChild(div);

        const nestedUl = document.createElement("ul");
        nestedUl.className = "toc toc-nested";
        buildTocItems(item.children, nestedUl); // 递归
        li.appendChild(nestedUl);
      }
      parentElement.appendChild(li);
    });
  }

  // 构建模块
  function buildModuleToc(tocData, parentElement) {
    parentElement.innerHTML = ""; // 【重要】清空旧的 TOC
    tocData.forEach((moduleWrapper) => {
      const module = Object.values(moduleWrapper)[0];
      if (!module) return;

      const moduleLi = document.createElement("li");
      moduleLi.className = "toc-module-container";

      // 创建模块标题
      const moduleHeader = document.createElement("div");
      moduleHeader.className = "toc-module-header";
      moduleHeader.textContent = module.title;
      moduleLi.appendChild(moduleHeader);

      // 创建该模块的文章列表
      const moduleArticleList = document.createElement("ul");
      // 默认展开
      moduleArticleList.className = "toc toc-nested expanded";

      // 使用递归函数填充这个列表
      buildTocItems(module.articles, moduleArticleList);

      moduleLi.appendChild(moduleArticleList);
      parentElement.appendChild(moduleLi);
    });
  }

  /**
   * 根据URL中的模块名过滤并构建目录
   * @param {string} moduleName - URL中的模块名
   */
  function filterAndBuildToc(moduleName) {
    if (!tocContainer || FULL_TOC_DATA.length === 0) return;

    // 尝试根据模块名过滤数据 (不区分大小写查找)
    const filteredData = FULL_TOC_DATA.filter((moduleWrapper) => {
      const module = Object.values(moduleWrapper)[0];
      // 使用严格的名称匹配
      return module && module.name === moduleName;
    });

    if (filteredData.length > 0) {
      buildModuleToc(filteredData, tocContainer);
    } else {
      // 如果找不到，显示错误
      tocContainer.innerHTML =
        '<li><span class="label" style="color: red;">找不到模块: ' +
        moduleName +
        "</span></li>";
    }
  }

  // 左侧TOC点击处理器 (事件委托) - 保持不变
  if (tocContainer) {
    tocContainer.addEventListener("click", (event) => {
      const folderHeader = event.target.closest(".toc-folder");
      if (folderHeader) {
        const parentLi = folderHeader.closest("li");
        if (parentLi) {
          parentLi.classList.toggle("expanded");
        }
      }
    });
  }

  // 更新 UI 元素 (标题，横幅等)
  function updateUI(metadata) {
    documentTitle.title = metadata.title + " | 冰窟 Blog";
    if (headerTitle) headerTitle.textContent = metadata.title;
    if (mainTitle) mainTitle.textContent = metadata.title;
    if (bannerBgCover)
      bannerBgCover.style.backgroundImage = metadata.bannerBg || "none";
    if (bannerTitleText)
      bannerTitleText.textContent = metadata.bannerTitle || "";
    if (bannerIcon) bannerIcon.textContent = metadata.icon || "";
  }

  // 加载文章 - 保持不变
  async function loadArticle(path, moduleName) {
    const metadata = ARTICLE_METADATA[path];
    if (!metadata) {
      if (headerTitle) headerTitle.textContent = "🤯加载文章错误";
      if (mainTitle) mainTitle.textContent = "Error";
      if (bannerBgCover) bannerBgCover.style.backgroundImage = "none";
      if (bannerTitleText) bannerTitleText.textContent = "Load Article Error";
      if (bannerIcon) bannerIcon.textContent = "?";
      articleContentContainer.innerHTML =
        "<h1>文章元数据未找到</h1><p>请检查 `metadata.json` 中是否存在路径：" +
        path +
        "</p>";
      return;
    }

    updateUI(metadata);
    updateChapterSwitcher(path, moduleName);
    try {
      const response = await fetch(STATIC + path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlContent = await response.text();
      articleContentContainer.innerHTML = htmlContent;
      // 代码高亮
      if (window.Prism) {
        Prism.highlightAll();
      }
      initializeArticleSpecificJS();
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("无法加载文章内容:", error);
      articleContentContainer.innerHTML =
        '<h1 class="title">加载文章内容失败</h1><p>请检查文件路径是否正确：' +
        path +
        "</p>";
    }
  }

  /**
   * 路由 处理URL哈希变化
   */
  async function handleRouteChange() {
    let hash = window.location.hash.substring(1); // 移除 '#'

    // 分离模块名和文章路径
    const hashParts = hash.split("/");
    let moduleName = hashParts[0] || "";
    let articlePathWithAnchor = hashParts.slice(1).join("/");

    // 1. 自动填充模块名
    if (!moduleName && FULL_TOC_DATA.length > 0) {
      // 获取第一个模块的名称
      moduleName = Object.values(FULL_TOC_DATA[0])[0].name;

      // 默认跳转到第一个模块
      window.location.replace(`#${moduleName}`);
      return;
    }

    // 2. 过滤并构建左侧目录
    filterAndBuildToc(moduleName);

    // 3. 处理文章路径
    if (!articlePathWithAnchor) {
      // 如果没有文章路径，自动加载当前模块的第一个文章
      const firstFileLink = document.querySelector(
        ".toc-module-container a.toc-file"
      );
      if (firstFileLink && moduleName) {
        const path = firstFileLink.dataset.path;
        // 构建完整的 URL： #模块名/文章路径
        window.location.replace(`#${moduleName}/${path}`);
        return;
      } else {
        // 如果模块内没文章
        articleContentContainer.innerHTML =
          '<h1 class="title">该模块下没有文章或模块名错误</h1>';
        return;
      }
    }

    // 分离文章路径和锚点
    const articleAndAnchor = articlePathWithAnchor.split("#");
    const path = articleAndAnchor[0]; // 文章路径
    // const anchor = articleAndAnchor.length > 1 ? articleAndAnchor[1] : "";

    // 4. 检查文章是否需要重新加载
    const currentPath = articleContentContainer.dataset.currentPath;
    if (currentPath !== path) {
      articleContentContainer.dataset.currentPath = path;
      await loadArticle(path, moduleName);
    }

    // 5. 高亮左侧栏的当前激活项
    document.querySelectorAll(".leftbar .toc-item").forEach((link) => {
      if (link.tagName === "A" && link.dataset.path === path) {
        link.classList.add("active");
        // 确保其父级文件夹被展开
        let current = link.closest("ul.toc-nested");
        while (current) {
          const parentLi = current.closest("li");
          if (parentLi && !parentLi.classList.contains("expanded")) {
            parentLi.classList.add("expanded");
          }
          // 向上查找下一个嵌套列表，直到 moduleLi
          current = parentLi.closest("ul.toc-nested");
        }
      } else {
        link.classList.remove("active");
      }
    });
  }

  // 启动应用
  async function loadMetadata() {
    try {
      // 路径更新
      const response = await fetch("../../json/articles/metadata.json");
      if (!response.ok) throw new Error("无法加载 metadata.json");
      ARTICLE_METADATA = await response.json();
    } catch (error) {
      console.error("加载元数据失败:", error);
      document.body.innerHTML =
        "<h1>初始化失败</h1><p>无法加载 `../../json/articles/metadata.json` 文件。请检查文件是否存在且格式正确。</p>";
      throw error;
    }
  }

  /**
   * 加载完整的 articles.json 数据
   */
  async function loadFullTocData() {
    try {
      const response = await fetch("../../json/articles/articles.json");
      if (!response.ok) throw new Error("无法加载 articles.json");
      FULL_TOC_DATA = await response.json();
    } catch (error) {
      console.error("加载完整目录失败:", error);
      if (tocContainer) {
        tocContainer.innerHTML =
          '<li><span class="label" style="color: red;">加载目录失败</span></li>';
      }
      throw error;
    }
  }

  async function initializeApp() {
    // 运行所有静态UI初始化
    initializeStaticUI();

    // 加载元数据
    try {
      await loadMetadata();
    } catch {
      return;
    }

    // 获取完整的TOC数据
    try {
      await loadFullTocData();
    } catch {
      return;
    }

    // 监听URL哈希值的变化
    window.addEventListener("hashchange", handleRouteChange);

    // 立即运行一次，处理初始页面加载 (现在会处理模块路由)
    handleRouteChange();
  }

  initializeApp();
});
