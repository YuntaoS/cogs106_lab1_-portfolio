// from global.js
import { fetchJSON, renderProjects } from "../global.js";


const projects = await fetchJSON("../lib/projects.json");
console.log(" Loaded projects:", projects);

const container = document.querySelector(".projects");

container.innerHTML = "";

for (const p of projects) {
  renderProjects(p, container, 'h2');
}

const titleElement = document.querySelector('.projects-title');
if (titleElement) {
  titleElement.textContent = `My Projects (${projects.length})`;
}