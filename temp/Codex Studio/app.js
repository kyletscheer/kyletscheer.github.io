(function () {
  const data = window.portfolioData || { apps: [], webProjects: [] };
  const state = {
    view: "chronology",
    projects: normalizeProjects(data.webProjects || []),
    apps: normalizeApps(data.apps || []),
  };

  const selectedGrid = document.getElementById("selectedGrid");
  const viewSelect = document.getElementById("viewSelect");
  const indexOutput = document.getElementById("indexOutput");
  const appsGrid = document.getElementById("appsGrid");

  renderSelected();
  renderIndex();
  renderApps();
  setupVideoObserver();

  viewSelect.addEventListener("change", () => {
    state.view = viewSelect.value;
    renderIndex();
  });

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
          category: classify(project),
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

  function renderSelected() {
    selectedGrid.innerHTML = state.projects
      .slice(0, 4)
      .map(
        (project) => `
          <article class="case-card">
            <div class="case-media">${video(project, "metadata")}</div>
            <div class="case-copy">
              <div class="case-date">${escapeHtml(project.date)} / ${escapeHtml(project.category)}</div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.text)}</p>
              <a class="open-link" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">${escapeHtml(project.title)}</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderIndex() {
    indexOutput.className = "index-output";
    if (state.view === "category") {
      renderCategoryIndex();
      return;
    }

    if (state.view === "compact") {
      renderCompactIndex();
      return;
    }

    renderChronologyIndex();
  }

  function renderChronologyIndex() {
    indexOutput.classList.add("grid-view");
    indexOutput.innerHTML = state.projects
      .map(
        (project) => `
          <article class="index-card">
            <div class="index-date">${escapeHtml(project.date)}</div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.text)}</p>
            <a class="open-link" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">${escapeHtml(project.category)}</a>
          </article>
        `
      )
      .join("");
  }

  function renderCategoryIndex() {
    const groups = groupBy(state.projects, "category");
    indexOutput.innerHTML = Object.keys(groups)
      .sort()
      .map(
        (category) => `
          <section class="index-group" aria-label="${escapeAttr(category)} projects">
            <h3>${escapeHtml(category)}</h3>
            <div class="compact-list">
              ${groups[category].map(compactRow).join("")}
            </div>
          </section>
        `
      )
      .join("");
  }

  function renderCompactIndex() {
    indexOutput.innerHTML = `
      <div class="compact-list">
        ${state.projects.map(compactRow).join("")}
      </div>
    `;
  }

  function compactRow(project) {
    return `
      <a class="compact-row" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">
        <span>${escapeHtml(project.date)}</span>
        <strong>${escapeHtml(project.title)}</strong>
        <span>${escapeHtml(project.category)}</span>
      </a>
    `;
  }

  function renderApps() {
    appsGrid.innerHTML = state.apps
      .map(
        (app) => `
          <article class="app-card">
            <a href="${escapeAttr(app.link)}" target="_blank" rel="noopener">
              <div class="app-media">${video(app, "metadata")}</div>
              <h3>${escapeHtml(app.title)}</h3>
              <p>${escapeHtml(app.text)}</p>
            </a>
          </article>
        `
      )
      .join("");
  }

  function setupVideoObserver() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { rootMargin: "130px", threshold: 0.2 }
    );

    document.querySelectorAll("video").forEach((item) => observer.observe(item));
  }

  function classify(project) {
    const text = `${project.title} ${project.description} ${project.link}`.toLowerCase();
    if (/travel|currency|timor|one bag|packing/.test(text)) return "Travel";
    if (/game|dice|wordle|numbers|letter|270|portmanteau/.test(text)) return "Games";
    if (/math|probability|conversion|convert|equation|weekday|date|rank|calculator/.test(text)) return "Math";
    if (/medium|analysis|guide|tree|knowledge|harry/.test(text)) return "Writing";
    return "Utility";
  }

  function video(item, preload) {
    return `
      <video src="${escapeAttr(item.media)}" muted loop playsinline preload="${preload}" aria-label="${escapeAttr(item.title)} preview"></video>
    `;
  }

  function groupBy(items, key) {
    return items.reduce((result, item) => {
      result[item[key]] = result[item[key]] || [];
      result[item[key]].push(item);
      return result;
    }, {});
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
