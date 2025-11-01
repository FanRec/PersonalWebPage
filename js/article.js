/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            佛祖保佑       永无BUG
*/

//生成目录
(function initRightbar() {
  const rightbar = document.getElementById("rightbar");
  const dic = document.getElementById("dictionary");
  const right_toggleBtn = document.getElementById("right-toggleBtn");

  const headings = Array.from(
    document.querySelectorAll(
      "article .article-content h2, article .article-content h3"
    )
  ).map((h, i) => {
    if (!h.id) h.id = "auto-" + i;
    return h;
  }); /*给没有id的h2和h3标签添加id属性为auto-数组中的索引 */
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
      document
        .getElementById(h.id)
        .scrollIntoView({ behavior: "smooth", block: "start" });
      //更新地址栏hash(不跳转)
      //   if (history.replaceState) history.replaceState(null, "", "#" + h.id);
      //   else location.hash = "#" + h.id;
      //在窄屏时点击收起
      if (window.matchMedia && window.matchMedia("(max-width:768px)").matches) {
        rightbar.classList.add("collapsed");
        right_toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
    li.appendChild(a);
    dic.appendChild(li);
  });
  /*建立一个id到a标签的映射*/
  const idToLink = {};
  dic
    .querySelectorAll("a")
    .forEach((a) => (idToLink[a.getAttribute("href").slice(1)] = a));
  /*将激活项设为高亮 */
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
      setActiveById(best.el.id);
      return;
    }
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
      setActiveById(above.id);
    } else {
      //如果都在视口下方，高亮第一个\
      if (headings[0]) setActiveById(headings[0].id);
    }
  }
  //初始运行一次
  updateActive();
  //监听滚动和resize
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  /*折叠展开逻辑 */
  function setCollapsed(collapsed) {
    if (collapsed) {
      rightbar.classList.add("collapsed");
      right_toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      rightbar.classList.remove("collapsed");
      right_toggleBtn.setAttribute("aria-expanded", "true");
    }
  }
  right_toggleBtn.addEventListener("click", () => {
    setCollapsed(!rightbar.classList.contains("collapsed"));
  });
  /* 初始：小屏默认收起，桌面展开 */
  function adapt() {
    if (window.matchMedia && window.matchMedia("(max-width:768px)").matches) {
      setCollapsed(true);
    } else setCollapsed(false);
  }
  adapt();
  window.addEventListener("resize", adapt);
  /* 如果开始时自带hash，平滑滚动到目标 */
  if (location.hash) {
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        60
      );
    }
  }
})();
//侧边栏折叠展开
(function () {
  const body = document.body;
  const left_toggleBtn = document.getElementById("left-toggleBtn");
  const top_toggleBtn = document.getElementById("top-toggleBtn");
  window.keepExpanded = true;
  function setCollapsed(collapsed) {
    if (collapsed) {
      body.classList.add("collapsed");
      left_toggleBtn.setAttribute("aria-expanded", "false");
      window.keepExpanded = false;
    } else {
      body.classList.remove("collapsed");
      left_toggleBtn.setAttribute("aria-expanded", "true");
      window.keepExpanded = true;
    }
  }
  left_toggleBtn.addEventListener("click", () => {
    setCollapsed(!body.classList.contains("collapsed"));
    top_toggleBtn.classList.remove("hide");
  });
  top_toggleBtn.addEventListener("click", () => {
    setCollapsed(!body.classList.contains("collapsed"));
    top_toggleBtn.classList.add("hide");
  });

  function adapt() {
    if (window.matchMedia && window.matchMedia("(max-width:900px)").matches) {
      body.classList.add("collapsed");
      left_toggleBtn.setAttribute("aria-expanded", "false");
      if (top_toggleBtn.classList.contains("hide"))
        top_toggleBtn.classList.remove("hide");
    } else {
      if (window.keepExpanded) {
        body.classList.remove("collapsed");
        left_toggleBtn.setAttribute("aria-expanded", "true");
        if (!top_toggleBtn.classList.contains("hide"))
          top_toggleBtn.classList.add("hide");
      }
    }
  }
  window.addEventListener("resize", adapt);
})();
//弹窗系统
(function () {
  const body = document.body;
  const showMenuPopup = document.getElementById("popMenuBtn");
  const popupContainer = document.querySelector(".popup-container");
  const closeBtn = document.querySelector(".pop-close-btn");
  const popupBoxs = popupContainer.children;
  function showPopupBase() {
    popupContainer.classList.add("active");
    if (!body.classList.contains("popup-open"))
      body.classList.add("popup-open");
  }
  closeBtn.onclick = () => {
    popupContainer.classList.remove("active");
    if (body.classList.contains("popup-open"))
      body.classList.remove("popup-open");
    popupBoxs.forEach((box) => {
      if (!box.classList.contains("hide")) box.classList.add("hide");
    });
  };
  showMenuPopup.onclick = () => {
    showPopupBase();
    if (
      popupContainer.querySelector(".menu-popup-box").classList.contains("hide")
    )
      popupContainer.querySelector(".menu-popup-box").classList.remove("hide");
  };
})();
//日夜间模式切换
(function () {
  const day_and_night_toggleBtn = document.getElementById("day_night_checkbox");
  const body = document.body;
  day_and_night_toggleBtn.addEventListener("change", () => {
    if (
      day_and_night_toggleBtn.checked &&
      !body.classList.contains("night-mode")
    ) {
      body.classList.add("night-mode");
    } else if (body.classList.contains("night-mode")) {
      body.classList.remove("night-mode");
    }
  });
})();
/* 文章切换功能 */
/* 文章目录管理 */
