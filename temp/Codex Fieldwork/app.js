(function () {
  const data = window.portfolioData || { apps: [], webProjects: [] };
  const state = {
    category: "Field utility",
    projects: normalizeProjects(data.webProjects || []),
    apps: normalizeApps(data.apps || []),
  };

  const evidenceSelect = document.getElementById("evidenceSelect");
  const evidenceGrid = document.getElementById("evidenceGrid");
  const appsGrid = document.getElementById("appsGrid");

  renderEvidence();
  renderApps();
  setupVideoObserver();

  evidenceSelect.addEventListener("change", () => {
    state.category = evidenceSelect.value;
    renderEvidence();
    setupVideoObserver();
  });

  function normalizeProjects(projects) {
    return projects
      .map((project, index) => {
        const date = parseDate(project.date);
        const category = classify(project);
        return {
          ...project,
          id: slug(`${project.title}-${index}`),
          media: asset(project.screenshotURL),
          text: strip(project.description),
          dateObject: date,
          category,
          evidence: evidenceLine(project, category),
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

  function renderEvidence() {
    const projects = state.projects
      .filter((project) => state.category === "All" || project.category === state.category)
      .slice(0, state.category === "All" ? 12 : 6);

    evidenceGrid.innerHTML = projects
      .map(
        (project) => `
          <article class="evidence-card">
            <div class="evidence-media">${video(project, "none")}</div>
            <div class="evidence-copy">
              <div class="card-meta">
                <span>${escapeHtml(project.date)}</span>
                <span>${escapeHtml(project.category)}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.evidence)}</p>
              <a class="evidence-link" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">Open project</a>
            </div>
          </article>
        `
      )
      .join("");
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
    if (window.fieldworkObserver) window.fieldworkObserver.disconnect();
    window.fieldworkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { rootMargin: "150px", threshold: 0.18 }
    );
    document.querySelectorAll("video").forEach((item) => window.fieldworkObserver.observe(item));
  }

  function classify(project) {
    const text = `${project.title} ${project.description} ${project.link}`.toLowerCase();
    if (/one bag|travel|currency|timor|download|squarespace|utility|assets|microlet/.test(text)) {
      return "Field utility";
    }
    if (/mental|convert|weekday|numbers|letters|historicle|language|timor|test|explainer/.test(text)) {
      return "Learning design";
    }
    if (/rank|probability|calculator|equitable|finance|decision|equation|distribution/.test(text)) {
      return "Decision support";
    }
    if (/game|dice|portmanteau|270|wordle|chapter/.test(text)) {
      return "Games and engagement";
    }
    return "Field utility";
  }

  function evidenceLine(project, category) {
    const title = project.title.toLowerCase();
    if (category === "Field utility") {
      if (title.includes("one bag")) return "Shows practical systems thinking for travel, packing constraints, and communicating a setup clearly.";
      if (title.includes("squarespace")) return "Shows ability to build a focused utility around a real operational bottleneck.";
      if (title.includes("travelcents")) return "Connects travel preparation, numeracy, and lightweight mobile-first learning.";
      if (title.includes("timor")) return "Shows interest in language, place, and tools that support cross-cultural learning.";
      return "Demonstrates practical tool-building for everyday constraints and lightweight workflows.";
    }

    if (category === "Learning design") {
      if (title.includes("mental")) return "Turns abstract conversion work into step-by-step practice, useful for training and self-directed learning.";
      if (title.includes("weekday")) return "Combines explainer, calculator, and timed practice into a compact learning experience.";
      if (title.includes("numbers")) return "Uses game mechanics to create repeated practice around reasoning and numeracy.";
      return "Shows ability to make learning interactive, testable, and approachable.";
    }

    if (category === "Decision support") {
      if (title.includes("rankit")) return "Builds structured comparison methods for decisions with multiple criteria and tradeoffs.";
      if (title.includes("probability")) return "Makes uncertainty and probability more concrete through calculation and experimentation.";
      if (title.includes("equitable")) return "Applies a clear model to a sensitive distribution problem where fairness matters.";
      return "Shows comfort turning messy judgment calls into clearer calculations or workflows.";
    }

    if (category === "Games and engagement") {
      if (title.includes("liar")) return "Shows how probability and game context can become a practical decision aid.";
      if (title.includes("portmanteau")) return "Uses playful constraints to create an engaging, memorable interaction.";
      return "Shows ability to make participation and practice feel lightweight and engaging.";
    }

    return strip(project.description);
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
