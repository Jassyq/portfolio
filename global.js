console.log("IT’S ALIVE!");

const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "CV" },
  { url: "contacts/", title: "Contacts" },
  { url: "meta/", title: "Meta" },
  { url: "https://github.com/Jassyq", title: "Github" },
  
];

// Step 3.1: Create <nav> and prepend to <body>
let nav = document.createElement('nav');
document.body.prepend(nav);

// Step 3.1: Compute BASE_PATH for local vs GitHub Pages
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                // Local dev
  : "/portfolio/";     // ← your repo name on GH Pages

// Step 3.2: Loop pages, build <a>, handle rel paths & externals
for (let p of pages) {
  let url   = p.url;
  let title = p.title;

  // prefix relative URLs with our BASE_PATH
  url = url.startsWith('http') ? url : BASE_PATH + url;

  // create the link element
  let a = document.createElement('a');
  a.href        = url;
  a.textContent = title;

  // open external links in a new tab
  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
  }

  // highlight the current page
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  // append into our nav
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`,
);

const select = document.querySelector('.color-scheme select');
// 2) On page load, restore previous setting (if any)
if (localStorage.getItem('colorScheme')) {
  const saved = localStorage.getItem('colorScheme');
  document.documentElement.style.colorScheme = saved;
  select.value = saved;
}
// 3) When the user changes the dropdown…
select.addEventListener('input', function (event) {
  const scheme = event.target.value;                 // "light dark", "light", or "dark"
  document.documentElement.style.colorScheme = scheme;
  localStorage.setItem('colorScheme', scheme);       // persist it
  console.log('color scheme changed to', scheme);
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach((project) => {
    const article = document.createElement('article');
    article.innerHTML = `
    <h3>${project.title}</h3>
    <p class="project-year">c. ${project.year}</p>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
    
`;
  containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}