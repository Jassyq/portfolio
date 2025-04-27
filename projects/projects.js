import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
document.querySelector('h1').textContent = `${projects.length} Projects`;
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

