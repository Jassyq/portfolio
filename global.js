console.log("IT’S ALIVE!");

const pages = [
  { url: "../index.html", title: "Home" },
  { url: "../projects/index.html", title: "Projects" },
  { url: "../resume/index.html", title: "CV" },
  { url: "../contacts/index.html", title: "Contacts" },
  { url: "https://github.com/Jassyq", title: "Github" },
];

const nav = document.createElement("nav");
document.body.prepend(nav);

// track whether we ever found a matching link
let foundCurrent = false;

for (let p of pages) {
  const a = document.createElement("a");
  a.href = p.url;
  a.textContent = p.title;

  // exact‐match check
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
    foundCurrent = true;
  }

  // external links open in new tab
  if (a.host !== location.host) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  nav.append(a);
}

// **fallback** to Home if nothing matched**
if (!foundCurrent) {
  nav.querySelector("a").classList.add("current");
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
