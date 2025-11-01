document.addEventListener("DOMContentLoaded", () => {
  // 静态元素
  const body = document.body;
  const tocContainer = document.getElementById("toc-container");
  const articleContentContainer = document.getElementById("article-content"); // 核心内容注入点

  // 文章元数据 UI 元素
  const headerTitle = document.getElementById("article-title-header");
  const mainTitle = document.getElementById("main-article-title");
  const bannerBgCover = document.getElementById("banner-bg-cover");
  const bannerTitleText = document.getElementById("banner-title-text");
  const bannerIcon = document.getElementById("banner-icon");
  const documentTitle = document;

  let ARTICLE_METADATA = {}; // 存储 metadata.json 数据
  let STATIC = "../../static/";

  // 静态UI逻辑
  function initializeStaticUI() {
    // 侧边栏折叠展开 (leftbar)
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
  // 右侧目录生成和滚动高亮代码
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
          history.pushState(null, null, "#" + h.id);
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
      const offset = 80;
      let activeId = null;

      for (const h of headings) {
        const r = h.getBoundingClientRect();
        if (r.top > 0 && r.top < viewportHeight) {
          if (r.top > 0 && r.top <= offset) {
            activeId = h.id;
            break;
          } else if (!activeId) {
            activeId = h.id;
          }
        } else if (r.top < 0) {
          activeId = h.id;
        }
      }

      if (!activeId && headings[0]) {
        activeId = headings[0].id;
      }

      setActiveById(activeId);
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

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
      if (window.matchMedia && window.matchMedia("(max-width:768px)").matches) {
        setRightCollapsed(true);
      } else setRightCollapsed(false);
    }
    adaptRightbar();
    window.addEventListener("resize", adaptRightbar);

    const initialHash = location.hash.slice(1);
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

  // SPA 路由和动态TOC逻辑
  // 递归：构建文件和文件夹
  function buildTocItems(items, parentElement) {
    items.forEach((item) => {
      const li = document.createElement("li");
      if (item.type === "file") {
        const a = document.createElement("a");
        a.className = "toc-item toc-file";
        a.href = `#${item.path}`;
        a.dataset.path = item.path;

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
    tocData.forEach((moduleWrapper) => {
      // 从 { "Module1": {...} } 中提取 "Module1" 对应的值
      const module = Object.values(moduleWrapper)[0];
      if (!module) return;

      const moduleLi = document.createElement("li");
      moduleLi.className = "toc-module-container";

      // 创建模块标题
      const moduleHeader = document.createElement("div");
      moduleHeader.className = "toc-module-header";
      moduleHeader.textContent = module.name; // e.g., "模块1"
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

  // 左侧TOC点击处理器 (事件委托)
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

  // 加载文章
  async function loadArticle(path) {
    const metadata = ARTICLE_METADATA[path];
    if (!metadata) {
      articleContentContainer.innerHTML =
        "<h1>文章元数据未找到</h1><p>请检查 `metadata.json` 中是否存在路径：" +
        path +
        "</p>";
      return;
    }

    updateUI(metadata);

    try {
      const response = await fetch(STATIC + path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlContent = await response.text();
      articleContentContainer.innerHTML = htmlContent;

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

  // 路由：处理URL哈希变化
  async function handleRouteChange() {
    let path = window.location.hash.substring(1);
    const hashParts = path.split("#");
    path = hashParts[0]; // 文章路径
    const anchor = hashParts.length > 1 ? hashParts[1] : "";

    if (!path) {
      const firstFileLink = document.querySelector(".toc-file");
      if (firstFileLink) {
        path = firstFileLink.dataset.path;
        window.location.replace(`#${path}`);
        return;
      } else {
        articleContentContainer.innerHTML =
          '<h1 class="title">请在 articles.json 和 metadata.json 中添加文章</h1>';
        return;
      }
    }

    const currentPath = articleContentContainer.dataset.currentPath;
    if (currentPath !== path) {
      articleContentContainer.dataset.currentPath = path;
      await loadArticle(path);
    }

    document.querySelectorAll(".leftbar .toc-item").forEach((link) => {
      if (link.tagName === "A" && link.dataset.path === path) {
        link.classList.add("active");
        let current = link.closest("ul.toc-nested");
        while (current) {
          const parentLi = current.closest("li");
          if (parentLi && !parentLi.classList.contains("expanded")) {
            parentLi.classList.add("expanded");
          }
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

  async function initializeApp() {
    // 运行所有静态UI初始化
    initializeStaticUI();

    // 加载元数据
    try {
      await loadMetadata();
    } catch {
      return; // 元数据失败，停止
    }

    // 获取TOC数据并构建左侧菜单
    try {
      // 路径更新
      const response = await fetch("../../json/articles/articles.json");
      if (!response.ok) throw new Error("无法加载 articles.json");
      const tocData = await response.json();

      // 逻辑更新
      buildModuleToc(tocData, tocContainer); // 使用新的模块化构建函数
    } catch (error) {
      console.error("加载目录失败:", error);
      tocContainer.innerHTML =
        '<li><span class="label" style="color: red;">加载目录失败</span></li>';
      return;
    }

    // 监听URL哈希值的变化
    window.addEventListener("hashchange", handleRouteChange);

    // 运行一次，处理初始页面加载
    handleRouteChange();
  }

  initializeApp();
});
