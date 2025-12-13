let portfolioData;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.portfolioData === "undefined") {
    console.error("Error: portfolioData.js not loaded.");
    return;
  }
  portfolioData = window.portfolioData;

  populateApps();
  populateProjects();
  setupDarkModeToggle();
  setupMoreProjectsToggle();
});

// ===================================
// CONTENT GENERATION FUNCTIONS
// ===================================

/**
 * Generates the appropriate HTML tag (img or video) based on the URL extension.
 * @param {string} url - The media URL.
 * @param {string} title - The project title for alt text.
 * @param {boolean} isApp - True if for an app (mobile display), false for web (desktop display).
 * @returns {string} The HTML for the media.
 */
function generateMediaHtml(url, title, isApp) {
  if (!url || url.includes("url_to_") || url.includes("images/.webp")) {
    const fallbackText = isApp
      ? "No Image Available"
      : "No Screenshot Available";
    const color = document.body.classList.contains("dark-mode")
      ? "var(--dark-text-context)"
      : "var(--light-text-context)";
    return `<div style="text-align: center; padding: 20px; color: ${color};">${fallbackText}</div>`;
  }

  const extension = url.split(".").pop().toLowerCase();
  let style = "width: 100%; height: 100%; object-fit: cover;";

  const lazyAttr = 'loading="lazy"';

  if (extension === "mp4" || extension === "gif") {
    return `<video ${lazyAttr} src="${url}" alt="${title} Media" autoplay loop muted playsinline style="${style}"></video>`;
  }

  // ADDED lazyAttr to the img tag
  return `<img ${lazyAttr} src="${url}" alt="${title} Screenshot" style="${style}" />`;
}

function populateApps() {
  const appsList = document.getElementById("apps-list");
  appsList.innerHTML = portfolioData.apps
    .map((app, index) => {
      const mediaHtml = generateMediaHtml(app.imageURL, app.title, true);

      return `
            <li>
                <div class="minimal-link" style="color: inherit; text-decoration: none; display: block;">
                    <div class="project-thumbnail-wrapper">
                        <div class="device-wrapper ios-wrapper">
                            <div class="screen-content">
                                ${mediaHtml}
                            </div>
                        </div>
                        <div style="cursor: pointer;" class="project-thumbnail-content"><a href="${app.link}" target="_blank" rel="noopener">
                            <strong>${app.title}</strong>
                            <span class="project-detail">${
                              app.description.split(".")[0]
                            }.</span>
                        </a></div>
                    </div>
                </div>
            </li>
        `;
    })
    .join("");
}

function generateProjectHtml(p, index, isHiddenList = false) {
  const mediaHtml = generateMediaHtml(p.screenshotURL, p.title, false);

  const originalIndex = portfolioData.webProjects.findIndex(
    (item) => item.title === p.title
  );

  return `
        <li>
                <div class="project-thumbnail-wrapper">
                    <div class="device-wrapper desktop-wrapper">
                        ${mediaHtml}
                    </div>
                    <div class="project-thumbnail-content"><a href="${p.link}" target="_blank" rel="noopener">
                        <strong>${p.title}</strong> (${p.date})
                        <span class="project-detail">${
                          p.description.split(".")[0]
                        }.</span>
                    </a></div>
                </div>
            </li>
    `;
}

function populateProjects() {
  const projectsListTop = document.getElementById("projects-list-top");
  const projectsListHidden = document.getElementById("projects-list-hidden");

  const sortedProjects = portfolioData.webProjects.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let topProjectsHtml = sortedProjects
    .slice(0, 5)
    .map((p, index) => generateProjectHtml(p, index, false))
    .join("");
  projectsListTop.innerHTML = topProjectsHtml;

  let hiddenProjectsHtml = sortedProjects
    .slice(5)
    .map((p, index) => generateProjectHtml(p, index, true))
    .join("");
  projectsListHidden.innerHTML = hiddenProjectsHtml;
}

function setupDarkModeToggle() {
  const toggleButton = document.getElementById("darkModeToggle");
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  toggleButton.textContent = isDarkMode
    ? "Toggle Light Mode"
    : "Toggle Dark Mode";

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const newIsDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", newIsDarkMode);
    toggleButton.textContent = newIsDarkMode
      ? "Toggle Light Mode"
      : "Toggle Dark Mode";
  });
}

function setupMoreProjectsToggle() {
  const moreButton = document.getElementById("more-projects-button");
  const hiddenProjectsDiv = document.getElementById("projects-list-more");
  const hasHiddenProjects = portfolioData.webProjects.length > 5;

  if (!hasHiddenProjects) {
    moreButton.style.display = "none";
    return;
  }

  moreButton.addEventListener("click", () => {
    const isHidden = hiddenProjectsDiv.style.display === "none";
    hiddenProjectsDiv.style.display = isHidden ? "block" : "none";
    moreButton.textContent = isHidden
      ? "Show Fewer Projects"
      : "Show All Projects";

    if (!isHidden) {
      window.scrollTo({
        top: document.getElementById("note-main").offsetTop,
        behavior: "smooth",
      });
    }
  });
}
