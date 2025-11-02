// ========= from global.js =========
import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// ========= Step 0: Load projects =========
const projects = await fetchJSON("../lib/projects.json");
console.log("✅ Loaded projects:", projects);

const projectsContainer = document.querySelector(".projects");
const titleElement = document.querySelector(".projects-title");
if (titleElement) titleElement.textContent = `My Projects (${projects.length})`;

// ========= Step 1–5: Render Pie Chart + Filtering =========
let selectedIndex = -1; // -1 表示未选中任何 wedge
let query = ""; // 用于搜索栏过滤

function renderPieChart(projectsGiven) {
  // ---- 汇总每年项目数 ----
  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year ?? "Unknown",
    value: count,
  }));

  // ---- 创建绘图器 ----
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // ---- 清空旧内容 ----
  const svg = d3.select("#projects-pie-plot");
  svg.selectAll("path").remove();
  const legend = d3.select(".legend");
  legend.selectAll("*").remove();

  // ---- 绘制饼图 ----
  arcData.forEach((d, i) => {
    svg
      .append("path")
      .attr("d", arcGenerator(d))
      .attr("fill", colors(i))
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("class", i === selectedIndex ? "selected" : null)
      .on("click", () => {
        // 点击交互：重复点击取消选中
        selectedIndex = selectedIndex === i ? -1 : i;
        updateFilter();
      });
  });

  // ---- 绘制图例 ----
  data.forEach((d, i) => {
    legend
      .append("li")
      .attr("style", `--color:${colors(i)}`)
      .attr(
        "class",
        i === selectedIndex ? "selected legend-item" : "legend-item"
      )
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateFilter();
      });
  });

  // ---- 更新函数（重绘选中状态与项目过滤） ----
  function updateFilter() {
    // 更新 path 高亮状态
    svg
      .selectAll("path")
      .attr("class", (_, idx) => (idx === selectedIndex ? "selected" : null));

    // 更新 legend 高亮状态
    legend
      .selectAll("li")
      .attr(
        "class",
        (_, idx) =>
          (idx === selectedIndex ? "selected legend-item" : "legend-item")
      );

    // 计算搜索 + 饼图双重过滤
    const filteredProjects = projects.filter((p) => {
      const matchesQuery = Object.values(p)
        .join("\n")
        .toLowerCase()
        .includes(query);
      const matchesYear =
        selectedIndex === -1 ||
        String(p.year) === String(data[selectedIndex].label);
      return matchesQuery && matchesYear;
    });

    // 渲染过滤结果
    renderProjects(filteredProjects, projectsContainer, "h2");
    if (titleElement)
      titleElement.textContent = `My Projects (${filteredProjects.length})`;

    // ✅ 重新绘制饼图与图例（保持响应性）
    renderPieChart(filteredProjects);
  }
}

// 初次渲染
renderProjects(projects, projectsContainer, "h2");
renderPieChart(projects);

// ========= Step 4 + Step 5: Search Filter =========
const searchInput = document.querySelector(".searchBar");

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();

  const filteredProjects = projects.filter((p) => {
    const values = Object.values(p).join("\n").toLowerCase();
    const matchesQuery = values.includes(query);
    const matchesYear =
      selectedIndex === -1 ||
      String(p.year) === String(p.year) === String(selectedIndex);
    return matchesQuery && matchesYear;
  });

  renderProjects(filteredProjects, projectsContainer, "h2");
  renderPieChart(filteredProjects);

  if (titleElement)
    titleElement.textContent = `My Projects (${filteredProjects.length})`;
});

