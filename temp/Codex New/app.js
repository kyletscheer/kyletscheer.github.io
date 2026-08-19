(function () {
  const data = window.portfolioData;

  if (!data) {
    document.body.innerHTML =
      '<main class="project-lab"><h1>Portfolio data could not load.</h1></main>';
    return;
  }

  const monthIndex = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const state = {
    filter: "All",
    query: "",
    projects: normalizeProjects(data.webProjects || []),
    apps: normalizeApps(data.apps || []),
  };

  const tags = ["All", "Game", "Travel", "Math", "Tool", "Writing"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const elements = {
    featuredPreview: document.getElementById("featuredPreview"),
    signalGrid: document.getElementById("signalGrid"),
    appsList: document.getElementById("appsList"),
    projectGrid: document.getElementById("projectGrid"),
    filterPills: document.getElementById("filterPills"),
    search: document.getElementById("projectSearch"),
    emptyState: document.getElementById("emptyState"),
    timeline: document.getElementById("timelineList"),
    themeToggle: document.getElementById("themeToggle"),
    currentYear: document.getElementById("currentYear"),
    dialog: document.getElementById("projectDialog"),
    dialogClose: document.getElementById("dialogClose"),
    dialogMedia: document.getElementById("dialogMedia"),
    dialogTitle: document.getElementById("dialogTitle"),
    dialogDate: document.getElementById("dialogDate"),
    dialogDescription: document.getElementById("dialogDescription"),
    dialogLink: document.getElementById("dialogLink"),
  };

  init();

  function init() {
    elements.currentYear.textContent = new Date().getFullYear();
    setupTheme();
    renderHero();
    renderApps();
    renderFilters();
    setupFilters();
    renderProjects();
    renderTimeline();
    setupMediaPlayback();
    setupDialog();
    setupSearch();
  }

  function normalizeProjects(projects) {
    return projects
      .map((project, index) => ({
        ...project,
        id: slugify(`${project.title}-${index}`),
        mediaURL: assetPath(project.screenshotURL),
        plainDescription: stripHtml(project.description || ""),
        dateObject: parsePortfolioDate(project.date),
        year: parsePortfolioDate(project.date).getFullYear(),
        tags: deriveTags(project),
      }))
      .sort((a, b) => b.dateObject - a.dateObject);
  }

  function normalizeApps(apps) {
    return apps.map((app, index) => ({
      ...app,
      id: slugify(`${app.title}-${index}`),
      mediaURL: assetPath(app.imageURL),
      plainDescription: stripHtml(app.description || ""),
    }));
  }

  function assetPath(path) {
    if (!path || /^https?:\/\//.test(path)) return path;
    if (path.startsWith("../")) return path;
    return `../${path}`;
  }

  function parsePortfolioDate(value) {
    const fallback = new Date(2000, 0, 1);
    if (!value || typeof value !== "string") return fallback;
    const parts = value.replace(",", "").trim().split(/\s+/);
    const month = monthIndex[(parts[0] || "").slice(0, 3).toLowerCase()];
    const year = Number(parts[1]);
    if (Number.isNaN(year)) return fallback;
    return new Date(year, month ?? 0, 1);
  }

  function deriveTags(project) {
    const text = `${project.title} ${project.description} ${project.link}`.toLowerCase();
    const found = [];

    if (/game|dice|wordle|numbers|letter|chapter|270|portmanteau/.test(text)) found.push("Game");
    if (/travel|currency|timor|one bag|microlet|packing/.test(text)) found.push("Travel");
    if (/math|probability|conversion|convert|equation|calculator|weekday|date|measurement|rank/.test(text)) found.push("Math");
    if (/tool|utility|download|generator|calculator|assets|rankit/.test(text)) found.push("Tool");
    if (/medium|analysis|guide|tree|knowledge|harry potter/.test(text)) found.push("Writing");

    return found.length ? found : ["Tool"];
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function stripHtml(value) {
    const template = document.createElement("template");
    template.innerHTML = value;
    return template.content.textContent.trim();
  }

  function renderHero() {
    const featured = state.projects[0];
    const firstYear = Math.min(...state.projects.map((project) => project.year));
    const years = new Date().getFullYear() - firstYear + 1;

    elements.featuredPreview.innerHTML = `
      <div class="featured-frame">
        ${videoMarkup(featured, "metadata")}
      </div>
      <div class="featured-caption">
        <p class="eyebrow">${escapeHtml(featured.date || "Featured")}</p>
        <h3>${escapeHtml(featured.title)}</h3>
        <p>${escapeHtml(featured.plainDescription)}</p>
        <button class="button secondary" type="button" data-preview="${featured.id}">Preview latest project</button>
      </div>
    `;

    elements.signalGrid.innerHTML = [
      [state.projects.length, "web projects"],
      [state.apps.length, "iOS apps"],
      [years, "years building"],
      ["0", "ads or locks"],
    ]
      .map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
      .join("");

  }

  function renderApps() {
    elements.appsList.innerHTML = state.apps
      .map(
        (app) => `
          <article class="app-card">
            <a href="${escapeAttribute(app.link)}" target="_blank" rel="noopener">
              <div class="phone-frame">${videoMarkup(app, "metadata")}</div>
              <h3>${escapeHtml(app.title)}</h3>
              <p>${escapeHtml(app.plainDescription)}</p>
            </a>
          </article>
        `
      )
      .join("");
  }

  function renderFilters() {
    elements.filterPills.innerHTML = tags
      .map(
        (tag) => `
          <button class="filter-pill" type="button" aria-pressed="${tag === state.filter}" data-filter="${tag}">
            ${tag}
          </button>
        `
      )
      .join("");
  }

  function setupFilters() {
    elements.filterPills.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      state.filter = button.dataset.filter;
      renderFilters();
      renderProjects();
    });
  }

  function renderProjects() {
    const query = state.query.trim().toLowerCase();
    const filtered = state.projects.filter((project) => {
      const matchesFilter =
        state.filter === "All" || project.tags.includes(state.filter);
      const haystack = `${project.title} ${project.plainDescription} ${project.date} ${project.tags.join(" ")}`.toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });

    elements.emptyState.hidden = filtered.length > 0;
    elements.projectGrid.innerHTML = filtered.map(projectCardMarkup).join("");
  }

  function projectCardMarkup(project) {
    return `
      <article class="project-card">
        <div class="media-frame">${videoMarkup(project, "none")}</div>
        <div class="card-copy">
          <div class="card-meta">
            <span>${escapeHtml(project.date || "")}</span>
            <span>${escapeHtml(project.tags[0] || "Project")}</span>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.plainDescription)}</p>
          <div class="tag-row">
            ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </div>
        <div class="card-actions">
          <button class="button secondary" type="button" data-preview="${project.id}">Preview</button>
          <a class="button primary" href="${escapeAttribute(project.link)}" target="_blank" rel="noopener">Open</a>
        </div>
      </article>
    `;
  }

  function renderTimeline() {
    const grouped = state.projects.reduce((years, project) => {
      years[project.year] = years[project.year] || [];
      years[project.year].push(project);
      return years;
    }, {});

    elements.timeline.innerHTML = Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .map(
        (year) => `
          <section class="timeline-year" aria-label="${year} projects">
            <h3>${year}</h3>
            <div class="timeline-items">
              ${grouped[year]
                .map(
                  (project) => `
                    <a class="timeline-item" href="${escapeAttribute(project.link)}" target="_blank" rel="noopener">
                      <span>${escapeHtml(project.date || "")}</span>
                      <strong>${escapeHtml(project.title)}</strong>
                      <span>${escapeHtml(project.tags[0] || "Project")} ↗</span>
                    </a>
                  `
                )
                .join("")}
            </div>
          </section>
        `
      )
      .join("");
  }

  function videoMarkup(item, preload) {
    if (!item.mediaURL) return "";
    return `
      <video
        class="preview-video"
        src="${escapeAttribute(item.mediaURL)}"
        muted
        loop
        playsinline
        preload="${preload}"
        aria-label="${escapeAttribute(item.title)} preview"
      ></video>
    `;
  }

  function setupMediaPlayback() {
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "180px 0px", threshold: 0.2 }
    );

    document.querySelectorAll(".preview-video").forEach((video) => {
      observer.observe(video);
    });

    const refreshObserver = new MutationObserver(() => {
      document.querySelectorAll(".preview-video:not([data-observed])").forEach((video) => {
        video.dataset.observed = "true";
        observer.observe(video);
      });
    });

    refreshObserver.observe(elements.projectGrid, { childList: true });
    document.querySelectorAll(".preview-video").forEach((video) => {
      video.dataset.observed = "true";
    });
  }

  function setupDialog() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-preview]");
      if (!button) return;
      openProject(button.dataset.preview);
    });

    elements.dialogClose.addEventListener("click", closeDialog);
    elements.dialog.addEventListener("click", (event) => {
      if (event.target === elements.dialog) closeDialog();
    });
    elements.dialog.addEventListener("close", () => {
      elements.dialogMedia.innerHTML = "";
      document.body.classList.remove("dialog-open");
    });
  }

  function openProject(id) {
    const project = state.projects.find((item) => item.id === id);
    if (!project) return;

    elements.dialogMedia.innerHTML = `
      <video src="${escapeAttribute(project.mediaURL)}" controls autoplay muted loop playsinline></video>
    `;
    elements.dialogTitle.textContent = project.title;
    elements.dialogDate.textContent = project.date || "Project";
    elements.dialogDescription.textContent = project.plainDescription;
    elements.dialogLink.href = project.link;
    document.body.classList.add("dialog-open");
    elements.dialog.showModal();
  }

  function closeDialog() {
    elements.dialog.close();
  }

  function setupSearch() {
    elements.search.addEventListener("input", () => {
      state.query = elements.search.value;
      renderProjects();
    });
  }

  function setupTheme() {
    const stored = localStorage.getItem("codexPortfolioTheme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(stored || (preferredDark ? "dark" : "light"));

    elements.themeToggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("codexPortfolioTheme", next);
    });
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    elements.themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
