// ========== STEP 1 ==========
console.log("IT’S ALIVE!");

// 快捷选择函数（返回元素数组）
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ========== STEP 3: 自动生成导航栏 ==========
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/YuntaoS", title: "GitHub" },
];

// 判断运行环境（本地 or GitHub Pages）
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/" // 本地 Live Server
    : "/cogs106_lab1_-portfolio/"; // ⚠️ 改成你 GitHub Pages 仓库名

// 创建导航栏
let nav = document.createElement("nav");
document.body.prepend(nav);

// 动态生成链接
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // 加上 BASE_PATH 前缀（仅对站内链接）
  if (!url.startsWith("http")) {
    url = BASE_PATH + url;
  }

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // 当前页高亮
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // 外部链接新标签打开
  a.toggleAttribute("target", a.host !== location.host);

  nav.append(a);
}

// ========== STEP 4: Dark Mode 切换 ==========
document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

// 获取 <select> 引用
const select = document.querySelector(".color-scheme select");

// 统一设置函数
function setColorScheme(value) {
  document.documentElement.style.setProperty("color-scheme", value);
  localStorage.colorScheme = value;
  select.value = value;
}

// 初始化：若有保存的偏好则加载
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

// 监听用户切换事件
select.addEventListener("input", (e) => {
  setColorScheme(e.target.value);
  console.log("Color scheme changed to →", e.target.value);
});
