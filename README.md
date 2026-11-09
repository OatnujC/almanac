# JT's Almanac

A warm, mobile-friendly calendar of world occasions. Plain HTML, CSS and JavaScript; no dependencies or build step. The calendar fetches `entries.json`, opens at the visitor’s current month, and allows navigation back to September 2026. Essay links return to their occasion’s month. Major occasions use terracotta highlights; minor occasions use sage highlights.

## GitHub Pages

In the repository’s **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/ (root)**, then save. All site files live at the repository root, with essays in `essays/`. `.nojekyll` keeps the files served as static assets. Paths are relative, so the site works at a GitHub Pages repository URL.

## How to add an entry

1. Copy `essays/_template.html` to `essays/YYYY-MM-DD-slug.html`, replacing the date and slug with the occasion’s values.
2. Fill in the title, date, summary meta tag, significance, essay body and linked sources. Replace both `YYYY-MM` back-link placeholders with the occasion’s month. Use a separate `<p>` for each essay paragraph.
3. Add an object to `entries.json`, keeping the array sorted by date (oldest first):

   ```json
   {
     "date": "2026-12-01",
     "title": "Occasion title",
     "significance": "minor",
     "summary": "A one-line introduction to the occasion.",
     "page": "essays/2026-12-01-occasion-title.html"
   }
   ```

   Use `major` or `minor` for significance and `YYYY-MM-DD` for the date. Keep valid JSON: commas between objects, no trailing comma. Multiple occasions can share a date. Dates before September 2026 are outside the calendar’s navigation range.
4. Preview the page and check the calendar link, essay text and source links.
5. Commit both the essay page and `entries.json` to `main`. GitHub Pages will serve the update without a build step.

## Local preview

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000`. Use an HTTP server: opening `index.html` as a local file can prevent `fetch` from loading the entries.

Each essay is a full-length piece (roughly 500–2,000 words of body text) with light `<h2>` subheadings inside `.prose` and a linked source list at the end. The essays were expanded and fact-checked on 9 November 2026; the Diwali essay reflects the main day of Sunday 8 November 2026.
