import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');
const githubData = await fetchGitHubData('jassyq');
const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
    profileStats.innerHTML = `
      <dl id="stats-grid">
        <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers</dt><dd>${githubData.followers}</dd>
        <dt>Following</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  
    const dl = document.querySelector('#stats-grid');
    // 1) Make it a 4-column grid
    Object.assign(dl.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.5rem 1.5rem',
      margin: '2rem 0'
    });
  
    // 2) Style <dt> as labels in row 1
    dl.querySelectorAll('dt').forEach(dt => {
      Object.assign(dt.style, {
        gridRow: '1',
        textAlign: 'center',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        color: 'hsl(210,10%,50%)',
        margin: '0'
      });
      // add the colon (since pseudo-elements can't be set via JS)
      dt.textContent = dt.textContent + ':';
    });
  
    // 3) Style <dd> as values in row 2
    dl.querySelectorAll('dd').forEach(dd => {
      Object.assign(dd.style, {
        gridRow: '2',
        margin: '0',
        fontSize: '1.75rem',
        fontWeight: '500',
        textAlign: 'center'
      });
    });
  }