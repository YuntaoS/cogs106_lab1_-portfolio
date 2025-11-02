import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js";

// STEP 2: Display Latest Projects
const projects = await fetchJSON("./lib/projects.json");
const latestProjects = projects.slice(-3).reverse();
const projectsContainer = document.querySelector(".projects");

if (Array.isArray(latestProjects) && projectsContainer) {
  renderProjects(latestProjects, projectsContainer, "h3");
}

// STEP 3: Fetch and Display GitHub Stats
const githubData = await fetchGitHubData("YuntaoS");
const profileStats = document.querySelector("#profile-stats");

if (githubData && profileStats) {
  profileStats.innerHTML = `
    <img src="${githubData.avatar_url}" width="80" alt="${githubData.login}'s avatar" style="border-radius:50%; margin-bottom:0.5em;">
    <dl>
      <dt>Followers</dt><dd>${githubData.followers}</dd>
      <dt>Following</dt><dd>${githubData.following}</dd>
      <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
    </dl>
  `;
}

