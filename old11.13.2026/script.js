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
  setupLightboxHandlers();
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

  const extension = url.split("?")[0].split(".").pop().toLowerCase();
  let style = "width: 100%; height: 100%; object-fit: cover;";

  const lazyAttr = 'loading="lazy"';

  if (extension === "mp4" || extension === "gif") {
    return `<video ${lazyAttr} src="${url}" alt="${title} Media" autoplay loop muted playsinline style="${style}"></video>`;
  }

  return `<img ${lazyAttr} src="${url}" alt="${title} Screenshot" style="${style}" />`;
}

function escapeAttribute(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isLightboxMedia(url) {
  if (typeof url !== "string") return false;
  const extension = url.split("?")[0].split(".").pop().toLowerCase();
  return extension === "mp4";
}

function createLightboxOverlay() {
  if (document.getElementById("lightbox-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.innerHTML = `
    <div class="lightbox-backdrop" role="dialog" aria-modal="true">
      <div class="lightbox-panel landscape">
        <button class="lightbox-close" type="button" aria-label="Close preview">&times;</button>
        <div class="lightbox-content">
          <div class="lightbox-media-container"></div>
          <div class="lightbox-meta">
            <h2 class="lightbox-title"></h2>
            <p class="lightbox-date"></p>
            <p class="lightbox-description"></p>
            <a class="lightbox-site-link minimal-link" href="#" target="_blank" rel="noopener">Visit Site</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (event) => {
    if (
      event.target === overlay ||
      event.target.classList.contains("lightbox-backdrop")
    ) {
      closeLightbox();
    }
  });

  overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      closeLightbox();
    }
  });
}

function openLightbox({ url, title, date, link, description, aspect = "landscape" }) {
  createLightboxOverlay();
  const overlay = document.getElementById("lightbox-overlay");
  const panel = overlay.querySelector(".lightbox-panel");
  const mediaContainer = overlay.querySelector(".lightbox-media-container");
  const titleElem = overlay.querySelector(".lightbox-title");
  const dateElem = overlay.querySelector(".lightbox-date");
  const descriptionElem = overlay.querySelector(".lightbox-description");
  const siteLink = overlay.querySelector(".lightbox-site-link");

  panel.classList.remove("landscape", "portrait");
  panel.classList.add(aspect === "portrait" ? "portrait" : "landscape");

  mediaContainer.innerHTML = `
    <video controls autoplay playsinline muted loop preload="metadata" src="${escapeAttribute(
      url
    )}" style="width:100%; height:100%; object-fit:contain;"></video>
  `;
  titleElem.textContent = title;
  dateElem.textContent = date ? date : "";
  descriptionElem.textContent = description ? description : "";
  siteLink.href = link;
  siteLink.textContent = "Visit Site";
  overlay.classList.add("active");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.classList.remove("lightbox-open");
  const mediaContainer = overlay.querySelector(".lightbox-media-container");
  if (mediaContainer) {
    mediaContainer.innerHTML = "";
  }
}

function populateApps() {
  const appsList = document.getElementById("apps-list");
  appsList.innerHTML = portfolioData.apps
    .map((app, index) => {
      const mediaHtml = generateMediaHtml(app.imageURL, app.title, true);
      const lightboxEnabled = isLightboxMedia(app.imageURL);
      const dataAttributes = lightboxEnabled
        ? `data-lightbox-url="${escapeAttribute(app.imageURL)}" data-lightbox-title="${escapeAttribute(
            app.title
          )}" data-lightbox-date="${escapeAttribute(app.date || "")}" data-lightbox-link="${escapeAttribute(
            app.link
          )}" data-lightbox-description="${escapeAttribute(app.description)}" data-lightbox-aspect="portrait"`
        : "";

      return `
            <li>
                <div class="minimal-link" style="color: inherit; text-decoration: none; display: block;">
                    <div class="project-thumbnail-wrapper">
                        <div class="device-wrapper ios-wrapper ${
                          lightboxEnabled ? "lightbox-thumbnail" : ""
                        }" ${dataAttributes}>
                            <div class="screen-content">
                                ${mediaHtml}
                            </div>
                            ${
                              lightboxEnabled
                                ? `<div class="thumbnail-overlay"><i class="fas fa-search-plus"></i></div>`
                                : ""
                            }
                        </div>
                        <div style="cursor: pointer;" class="project-thumbnail-content"><a href="${app.link}" target="_blank" rel="noopener">
                            <strong>${app.title}</strong>
                            <span class="project-detail">${
                              app.description
                            }</span>
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
  const lightboxEnabled = isLightboxMedia(p.screenshotURL);
  const dataAttributes = lightboxEnabled
    ? `data-lightbox-url="${escapeAttribute(p.screenshotURL)}" data-lightbox-title="${escapeAttribute(
        p.title
      )}" data-lightbox-date="${escapeAttribute(p.date || "")}" data-lightbox-link="${escapeAttribute(
        p.link
      )}" data-lightbox-description="${escapeAttribute(p.description)}"`
    : "";

  return `
        <li>
                <div class="project-thumbnail-wrapper">
                    <div class="device-wrapper desktop-wrapper ${
                      lightboxEnabled ? "lightbox-thumbnail" : ""
                    }" ${dataAttributes}>
                        ${mediaHtml}
                        ${
                          lightboxEnabled
                            ? `<div class="thumbnail-overlay"><i class="fas fa-search-plus"></i></div>`
                            : ""
                        }
                    </div>
                    <div class="project-thumbnail-content"><a href="${p.link}" target="_blank" rel="noopener">
                        <strong>${p.title}</strong> (${p.date})
                        <span class="project-detail">${
                          p.description
                        }</span>
                    </a></div>
                </div>
            </li>
    `;
}

function setupLightboxHandlers() {
  document.body.addEventListener("click", (event) => {
    const trigger = event.target.closest(".lightbox-thumbnail");
    if (!trigger) return;
    const url = trigger.dataset.lightboxUrl;
    if (!url) return;
    event.preventDefault();
    openLightbox({
      url,
      title: trigger.dataset.lightboxTitle || "",
      date: trigger.dataset.lightboxDate || "",
      link: trigger.dataset.lightboxLink || "#",
      description: trigger.dataset.lightboxDescription || "",
      aspect: trigger.dataset.lightboxAspect || "landscape",
    });
  });
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
