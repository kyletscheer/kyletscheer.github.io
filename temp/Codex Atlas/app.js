(function () {
  const data = window.portfolioData || { apps: [], webProjects: [] };
  const routes = ["All", "Travel", "Games", "Math", "Utilities", "Writing"];
  const state = {
    route: "All",
    activeId: "",
    projects: normalizeProjects(data.webProjects),
    apps: normalizeApps(data.apps),
  };

  const mapGrid = document.getElementById("mapGrid");
  const mapLegend = document.getElementById("mapLegend");
  const routeTabs = document.getElementById("routeTabs");
  const routeList = document.getElementById("routeList");
  const routePreview = document.getElementById("routePreview");
  const appGrid = document.getElementById("appGrid");
  const logbookList = document.getElementById("logbookList");

  state.activeId = state.projects[0]?.id || "";

  renderMap();
  renderRoutes();
  renderApps();
  renderLogbook();
  setupVideoObserver();

  function normalizeProjects(projects) {
    return projects
      .map((project, index) => {
        const date = parseDate(project.date);
        return {
          ...project,
          id: slug(`${project.title}-${index}`),
          media: asset(project.screenshotURL),
          text: strip(project.description),
          dateObject: date,
          year: date.getFullYear(),
          route: classify(project),
        };
      })
      .sort((a, b) => b.dateObject - a.dateObject);
  }

  function normalizeApps(apps) {
    return apps.map((app, index) => ({
      ...app,
      id: slug(`${app.title}-${index}`),
      media: asset(app.imageURL),
      text: strip(app.description),
    }));
  }

  function renderMap() {
    const pins = state.projects.slice(0, 11);
    mapGrid.innerHTML = pins
      .map((project, index) => {
        const x = 8 + ((index * 29) % 74);
        const y = 9 + ((index * 41) % 74);
        const tilt = [-5, 4, -2, 6, -4][index % 5];
        return `
          <a class="map-pin" href="${escapeAttr(project.link)}" target="_blank" rel="noopener"
            style="left:${x}%; top:${y}%; --tilt:${tilt}deg">
            <strong>${escapeHtml(project.title)}</strong>
            <span>${escapeHtml(project.date)}</span>
          </a>
        `;
      })
      .join("");

    const firstYear = Math.min(...state.projects.map((project) => project.year));
    mapLegend.innerHTML = [
      [state.projects.length, "mapped projects"],
      [state.apps.length, "pocket tools"],
      [`${firstYear}+`, "archive starts"],
    ]
      .map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
      .join("");
  }

  function renderRoutes() {
    routeTabs.innerHTML = routes
      .map(
        (route) => `
          <button type="button" data-route="${route}" aria-pressed="${route === state.route}">
            ${route}
          </button>
        `
      )
      .join("");

    const visible = state.projects.filter(
      (project) => state.route === "All" || project.route === state.route
    );
    if (!visible.some((project) => project.id === state.activeId)) {
      state.activeId = visible[0]?.id || state.projects[0]?.id || "";
    }

    routeList.innerHTML = visible
      .slice(0, 9)
      .map(
        (project) => `
          <button class="route-stop" type="button" data-project="${project.id}" aria-current="${project.id === state.activeId}">
            <span>${escapeHtml(project.date)}</span>
            <strong>${escapeHtml(project.title)}</strong>
          </button>
        `
      )
      .join("");

    const active = state.projects.find((project) => project.id === state.activeId) || visible[0];
    routePreview.innerHTML = active
      ? `
          <div class="preview-media">${video(active, "metadata")}</div>
          <div class="preview-copy">
            <p class="kicker">${escapeHtml(active.route)} route</p>
            <h3>${escapeHtml(active.title)}</h3>
            <p>${escapeHtml(active.text)}</p>
            <a class="button primary" href="${escapeAttr(active.link)}" target="_blank" rel="noopener">Open this stop</a>
          </div>
        `
      : "";

    routeTabs.querySelectorAll("[data-route]").forEach((button) => {
      button.addEventListener("click", () => {
        state.route = button.dataset.route;
        renderRoutes();
        setupVideoObserver();
      });
    });

    routeList.querySelectorAll("[data-project]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeId = button.dataset.project;
        renderRoutes();
        setupVideoObserver();
      });
    });
  }

  function renderApps() {
    appGrid.innerHTML = state.apps
      .map(
        (app) => `
          <article class="app-card">
            <a href="${escapeAttr(app.link)}" target="_blank" rel="noopener">
              <div class="app-phone">${video(app, "metadata")}</div>
              <h3>${escapeHtml(app.title)}</h3>
              <p>${escapeHtml(app.text)}</p>
            </a>
          </article>
        `
      )
      .join("");
  }

  function renderLogbook() {
    logbookList.innerHTML = state.projects
      .map(
        (project) => `
          <a class="log-entry" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">
            <span>${escapeHtml(project.date)}</span>
            <strong>${escapeHtml(project.title)}</strong>
            <span>${escapeHtml(project.route)}</span>
          </a>
        `
      )
      .join("");
  }

  function setupVideoObserver() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.atlasObserver) window.atlasObserver.disconnect();
    window.atlasObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { rootMargin: "160px", threshold: 0.2 }
    );
    document.querySelectorAll("video").forEach((item) => window.atlasObserver.observe(item));
  }

  function classify(project) {
    const text = `${project.title} ${project.description} ${project.link}`.toLowerCase();
    if (/travel|currency|timor|one bag|packing/.test(text)) return "Travel";
    if (/game|dice|wordle|letter|numbers|270|portmanteau/.test(text)) return "Games";
    if (/math|probability|conversion|convert|equation|weekday|date|rank/.test(text)) return "Math";
    if (/medium|analysis|guide|tree|knowledge|harry/.test(text)) return "Writing";
    return "Utilities";
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
