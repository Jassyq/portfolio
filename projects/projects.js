import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1;
let query = '';

const projectsContainer = document.querySelector('.projects');

function updateView() {
  // start with all projects
  let filtered = allProjects;
  // apply year slice filter first, if any
  if (selectedIndex !== -1) {
    // get years in order for mapping index
    const years = d3.rollups(
      allProjects,
      v => v.length,
      d => d.year
    ).map(([year]) => year);
    const selectedYear = years[selectedIndex];
    filtered = filtered.filter(p => p.year === selectedYear);
  }
  // then apply search filter on that subset
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(p => {
      const text = [
        p.title,
        p.description,
        p.year.toString(),
        ...(p.tags || [])
      ].join(' ').toLowerCase();
      return text.includes(q);
    });
  }
  // render list and reapply highlights
  renderProjects(filtered, projectsContainer, 'h2');
  d3.selectAll('svg path')
    .classed('selected', (_, i) => i === selectedIndex);
  d3.select('.legend').selectAll('li')
    .classed('selected', (_, i) => i === selectedIndex);
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
      .classed('selected', (_, idx) => idx === selectedIndex)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateView();
      });
  });
  
  // draw legend
  data.forEach((d, i) => {
    legend.append('li')
      .classed('legend-item', true)
      .classed('selected', i === selectedIndex)
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
  // update query and refresh view
  query = event.target.value;
  updateView();
});