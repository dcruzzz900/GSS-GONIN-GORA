# Government Secondary School Gonin-Gora: website

A static website: no build step and no dependencies.

```
index.html     page structure
style.css      all styles (light mode: sea green and white; dark mode: navy, gold and white)
script.js      all behaviour (sliders, live school-day panel, calendar, gallery, forms)
images/        photos, staff avatars and the favicon
netlify.toml   Netlify settings
robots.txt
```

## Deploy with Netlify and GitHub
1. Create a GitHub repository and upload everything in this folder (keep the `images` folder).
2. In Netlify choose **Add new site, Import an existing project, GitHub** and pick the repository.
3. Leave the build command empty. The publish directory is `.` (already in `netlify.toml`). Click **Deploy**.
4. Every commit to the repository republishes the site.

## Admissions form
The form is a Netlify Form named `admissions`. Applications appear in Netlify under **Forms**.
For an email on each submission: **Forms, Form notifications, Add notification, Email notification**.

## Where to edit things
- Staff, gallery photos, news, events, term dates, houses: `script.js` (arrays near the top of each section).
- Replace a photo: put a new file in `images/` with the same name.
- Term dates: `TERMS` in `script.js` (use `YYYY-MM-DD`). Current term: `CUR`.
- School email and phone: `index.html` (top bar and footer) and `SCHOOL_EMAIL` / `SCHOOL_WA` in `script.js`.

## To confirm before launch
School email address and phone number, term dates, remaining staff names.
