# Hivemind Media website

Plain HTML, CSS and JavaScript. No build step.

## Files

- `index.html` – all the sections and text
- `styles.css` – the design. Change `--accent` at the top to change the brand colour
- `script.js` – booking link, project highlights and carousels
- `assets/logos/` – your logo and client logos (transparent PNGs)
- `assets/videos/` – put your edits here

## Before you publish

1. Open `script.js` and set `BOOKING_URL` to your booking link. Every "Book a Call" button uses it.
2. In `script.js`, edit the `PROJECTS` list: titles, client names and the stats. The numbers in there are samples.
3. Add your videos to `assets/videos/` as `short-1.mp4`, `short-2.mp4`, `long-1.mp4`, `long-2.mp4` (or change the paths in `PROJECTS`). Keep each file small (under about 10 MB) so the page loads fast.
4. In `index.html`, replace the four placeholder testimonials with real ones, or delete that section for now.

## Preview locally

Open the folder in VS Code, install the "Live Server" extension, right-click `index.html` and choose "Open with Live Server".

## Host on GitHub Pages

1. Create a new repository on GitHub and upload everything in this folder (keep `index.html` at the top level).
2. Go to Settings → Pages.
3. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, then Save.
4. Your site appears at `https://<your-username>.github.io/<repository-name>/` after a minute or two.
