// ========== STEP 1: Initialize ==========
console.log("IT’S ALIVE!");

// 快捷选择函数
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// STEP 3: 自动生成导航栏
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/YuntaoS", title: "GitHub" },
];

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/" // 本地 Live Server
    : "/cogs106_lab1_-portfolio/"; 

// 创建导航栏
let nav = document.createElement("nav");
document.body.prepend(nav);

// 动态生成链接
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith("http")) {
    url = BASE_PATH + url;
  }

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  a.toggleAttribute("target", a.host !== location.host);
  nav.append(a);
}

// STEP 4: Dark Mode 切换 
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

const select = document.querySelector(".color-scheme select");

function setColorScheme(value) {
  document.documentElement.style.setProperty("color-scheme", value);
  localStorage.colorScheme = value;
  select.value = value;
}

if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

select.addEventListener("input", (e) => {
  setColorScheme(e.target.value);
  console.log("Color scheme changed to →", e.target.value);
});

// STEP 1.2: fetchJSON
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
  }
}

// STEP 1.4: renderProjects 
export function renderProjects(projects, containerElement, headingLevel = "h2") {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    console.error("❌ Invalid container element provided.");
    return;
  }

  // 清空容器
  // containerElement.innerHTML = "";

  // 如果传入的不是数组，则转成数组
  const projectList = Array.isArray(projects) ? projects : [projects];

  // 逐个渲染项目
  for (const project of projectList) {
    const article = document.createElement("article");

    const title = project.title || "Untitled Project";
    const image = project.image || "https://via.placeholder.com/300x200?text=No+Image";
    const description = project.description || "No description available.";

    if (!/^h[1-6]$/.test(headingLevel)) {
      console.warn(`⚠️ Invalid heading level "${headingLevel}", defaulting to <h2>.`);
      headingLevel = "h2";
    }

    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      <img src="${image}" alt="${title}">
      <p>${description}</p>
    `;

    containerElement.appendChild(article);
  }
}


export async function fetchGitHubData(username) {
  try {
    const url = `https://api.github.com/users/${username}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ GitHub data fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching GitHub data:", error);
    return null;
  }
}
