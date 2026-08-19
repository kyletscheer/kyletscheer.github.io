(function () {
  const data = window.portfolioData || { apps: [], webProjects: [] };
  const modes = ["All", "Games", "Math", "Travel", "Tools", "Archive"];
  const state = {
    mode: "All",
    query: "",
    projects: normalizeProjects(data.webProjects || []),
    apps: normalizeApps(data.apps || []),
  };

  const els = {
    scoreboard: document.getElementById("scoreboard"),
    activeCategoryLabel: document.getElementById("activeCategoryLabel"),
    featuredCartridge: document.getElementById("featuredCartridge"),
    modeButtons: document.getElementById("modeButtons"),
    searchInput: document.getElementById("searchInput"),
    tokenGrid: document.getElementById("tokenGrid"),
    emptyMessage: document.getElementById("emptyMessage"),
    appStrip: document.getElementById("appStrip"),
  };

  renderScoreboard();
  renderModes();
  renderFeatured();
  renderTokens();
  renderApps();
  setupVideoObserver();

  els.searchInput.addEventListener("input", () => {
    state.query = els.searchInput.value;
    renderFeatured();
    renderTokens();
    setupVideoObserver();
  });

  function normalizeProjects(projects) {
    return projects
      .map((project, index) => {
        const date = parseDate(project.date);
        return {
          ...project,
          id: slug(`${project.title}-${index}`),
          media: asset(project.screenshotURL),
          cleanDescription: strip(project.description),
          dateObject: date,
          year: date.getFullYear(),
          mode: classify(project),
        };
      })
      .sort((a, b) => b.dateObject - a.dateObject);
  }

  function normalizeApps(apps) {
    return apps.map((app, index) => ({
      ...app,
      id: slug(`${app.title}-${index}`),
      media: asset(app.imageURL),
      cleanDescription: strip(app.description),
    }));
  }

  function renderScoreboard() {
    const firstYear = Math.min(...state.projects.map((project) => project.year));
    const stats = [
      ["Projects", state.projects.length],
      ["Apps", state.apps.length],
      ["Years", `${firstYear}-${new Date().getFullYear()}`],
      ["Price", "Free"],
    ];

    els.scoreboard.innerHTML = stats
      .map(([label, value]) => `<div class="score-row"><span>${label}</span><strong>${value}</strong></div>`)
      .join("");
  }

  function renderModes() {
    els.modeButtons.innerHTML = modes
      .map(
        (mode) => `
          <button type="button" data-mode="${mode}" aria-pressed="${mode === state.mode}">
            ${mode}
          </button>
        `
      )
      .join("");

    els.modeButtons.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        renderModes();
        renderFeatured();
        renderTokens();
        setupVideoObserver();
      });
    });
  }

  function renderFeatured() {
    els.activeCategoryLabel.textContent = state.mode;
    const project = filteredProjects()[0] || state.projects[0];
    if (!project) {
      els.featuredCartridge.innerHTML = "";
      return;
    }

    els.featuredCartridge.innerHTML = `
      <div class="featured-video">${video(project, "metadata")}</div>
      <div class="featured-copy">
        <p class="coin-text">${escapeHtml(project.date)} / ${escapeHtml(project.mode)}</p>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.cleanDescription)}</p>
        <a class="button" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">Play project</a>
      </div>
    `;
  }

  function renderTokens() {
    const projects = filteredProjects();
    els.emptyMessage.hidden = projects.length > 0;
    els.tokenGrid.innerHTML = projects
      .map(
        (project) => `
          <article class="tile">
            <div class="tile-media">${video(project, "none")}</div>
            <div class="tile-copy">
              <div class="tile-meta">
                <span>${escapeHtml(project.date)}</span>
                <span>${escapeHtml(project.mode)}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.cleanDescription)}</p>
            </div>
            <div class="tile-actions">
              <a class="button" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">Open</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderApps() {
    els.appStrip.innerHTML = state.apps
      .map(
        (app) => `
          <article class="app-card">
            <a href="${escapeAttr(app.link)}" target="_blank" rel="noopener">
              <div class="app-phone">${video(app, "metadata")}</div>
              <h3>${escapeHtml(app.title)}</h3>
              <p>${escapeHtml(app.cleanDescription)}</p>
            </a>
          </article>
        `
      )
      .join("");
  }

  function filteredProjects() {
    const query = state.query.trim().toLowerCase();
    return state.projects.filter((project) => {
      const modeMatch = state.mode === "All" || project.mode === state.mode;
      const text = `${project.title} ${project.cleanDescription} ${project.date} ${project.mode}`.toLowerCase();
      return modeMatch && (!query || text.includes(query));
    });
  }

  function setupVideoObserver() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.arcadeObserver) window.arcadeObserver.disconnect();
    window.arcadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { rootMargin: "140px", threshold: 0.18 }
    );
    document.querySelectorAll("video").forEach((videoEl) => window.arcadeObserver.observe(videoEl));
  }

  function classify(project) {
    const text = `${project.title} ${project.description} ${project.link}`.toLowerCase();
    if (/game|dice|wordle|numbers|letter|270|portmanteau/.test(text)) return "Games";
    if (/math|probability|conversion|convert|weekday|equation|rank|calculator/.test(text)) return "Math";
    if (/travel|currency|timor|one bag|packing/.test(text)) return "Travel";
    if (/medium|analysis|guide|tree|harry|knowledge/.test(text)) return "Archive";
    return "Tools";
  }

  function video(item, preload) {
    return `
      <video src="${escapeAttr(item.media)}" muted loop playsinline preload="${preload}" aria-label="${escapeAttr(item.title)} preview"></video>
    `;
  }

  function parseDate(value) {
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const [month, year] = String(value || "").replace(",", "").split(/\s+/);
    return new Date(Number(year) || 2000, months[String(month).slice(0, 3).toLowerCase()] || 0, 1);
  }

  function asset(path) {
    if (!path || /^https?:/.test(path)) return path || "";
    return path.startsWith("../") ? path : `../${path}`;
  }

  function strip(html) {
    const template = document.createElement("template");
    template.innerHTML = html || "";
    return template.content.textContent.trim();
  }

  function slug(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
