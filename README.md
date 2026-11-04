# Government Secondary School Gonin-Gora: website

A static website: no build step and no dependencies.

```
index.html     page structure
style.css      all styles (light mode: sea green and white; dark mode: navy, gold and white)
script.js      all behaviour (sliders, live school-day panel, calendar, gallery, forms)
images/        photos, staff avatars and the favicon
netlify.toml   Netlify settings
robots.txt
.nojekyll      lets GitHub Pages serve the files as they are
```

## Netlify (with GitHub)
1. Upload everything in this folder to a GitHub repository (keep the `images` folder).
2. In Netlify choose **Add new site, Import an existing project, GitHub** and pick the repository.
3. Leave the build command empty. The publish directory is `.` (set in `netlify.toml`). Click **Deploy**.

## GitHub Pages
1. The repository must be **Public** (free accounts).
2. **Settings, Pages, Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, Folder = `/ (root)`, then Save.
3. `index.html` must sit at the top level of the repository, not inside another folder.
4. The site opens at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/` after one to three minutes.
   (The admissions form saves applications only on Netlify. On GitHub Pages use the email and WhatsApp buttons.)

## Admissions form
The form is a Netlify Form named `admissions`. Applications appear in Netlify under **Forms**.
For an email on each submission: **Forms, Form notifications, Add notification, Email notification**.

## Where to edit things
- Staff, gallery photos, news, events, term dates, houses: `script.js`.
- Past principals: edit the `PAST` list in `script.js`. Add one line per principal with `n` (name), `y` (years served, for example `2005 to 2010`), `note` (a short text) and `img` (photo path). Put the photo in the `images/` folder, for example `img:'images/principal-name.jpg'`. Delete the three placeholder lines when you add real ones.
- Replace a photo: put a new file in `images/` with the same name.
- Term dates: `TERMS` in `script.js` (use `YYYY-MM-DD`). Current term: `CUR`.
- School email and phone: `index.html` (top bar and footer) and `SCHOOL_EMAIL` / `SCHOOL_WA` in `script.js`.
