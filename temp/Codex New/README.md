# Codex New

Static portfolio redesign concept for Kyle Scheer.

This version intentionally leaves the existing `../portfoliodata.js` file as the data source. The redesign normalizes the media paths at runtime so assets in `../images/` work from inside this folder.

Open `index.html` directly, or serve the repository root locally and visit:

```text
/Codex%20New/
```

Core ideas:

- Project-feed hero using the latest portfolio item
- App showcase with phone-framed video previews
- Searchable and filterable project grid
- Timeline archive grouped by year
- Accessible modal previews with controls
- Lightweight media loading with `preload="none"` for grid videos
- Theme toggle that respects system preference
