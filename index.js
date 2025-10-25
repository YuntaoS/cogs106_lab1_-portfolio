import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js";

// STEP 2: Display Latest Projects
const projects = await fetchJSON("./lib/projects.json");
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector(".projects");

//  这里不需要 for...of，一次性渲染所有
renderProjects(latestProjects, projectsContainer, "h3");

// STEP 3: Fetch and Display GitHub Stats
const githubData = await fetchGitHubData("YuntaoS");
const profileStats = document.querySelector("#profile-stats");

if (githubData && profileStats) {
  profileStats.innerHTML = `
    <dl>
      <dt>Followers</dt><dd>${githubData.followers}</dd>
      <dt>Following</dt><dd>${githubData.following}</dd>
      <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
    </dl>
  `;
}

