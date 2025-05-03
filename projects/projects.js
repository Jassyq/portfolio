import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1;
let query = '';

const projectsContainer = document.querySelector('.projects');

function updateView() {
  let filtered = allProjects.filter(project => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  if (selectedIndex !== -1) {
    const rolledData = d3.rollups(
      filtered,
      v => v.length,
      d => d.year
    );
    const data = rolledData.map(([year, count]) => ({ value: count, label: year }));
    const selectedYear = data[selectedIndex].label;
    filtered = filtered.filter(p => p.year === selectedYear);
  }

  renderProjects(filtered, projectsContainer, 'h2');

  d3.selectAll('svg path')
    .classed('selected', (_, idx) => idx === selectedIndex);
}

// Refactor pie and legend rendering into a function
function renderPieChart(projectsGiven) {
  // roll up data by year
  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );
  const data = rolledData.map(([year, count]) => ({ value: count, label: year }));
  
  // clear existing chart and legend
  const svg = d3.select('svg');
  svg.selectAll('path').remove();
  const legend = d3.select('.legend');
  legend.selectAll('li').remove();
  
  // generators and scales
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);
  
  // draw slices
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateView();
      });
  });
  
  // draw legend
  data.forEach((d, i) => {
    legend.append('li')
      .classed('legend-item', true)
      .attr('style', `--color:${colors(i)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

let allProjects = await fetchJSON('../lib/projects.json'); 
document.querySelector('h1').textContent = `${allProjects.length} Projects`;

renderPieChart(allProjects);
updateView();

//search
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = allProjects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  // update pie chart based on search filter
  renderPieChart(filteredProjects);
});
