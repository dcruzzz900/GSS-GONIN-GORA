# Government Secondary School Gonin-Gora: website

A single-page static website (HTML, CSS and JavaScript in `index.html`).

## Deploy with Netlify and GitHub
1. Create a GitHub repository and upload these files (`index.html`, `netlify.toml`, `README.md`).
2. In Netlify choose **Add new site, Import an existing project, GitHub**, then pick the repository.
3. Leave the build command empty and the publish directory as `.` (already set in `netlify.toml`), then click **Deploy**.
4. Every time you commit a new `index.html` to the repository, Netlify republishes the site automatically.

## Admissions form
The admissions form is a Netlify Form named `admissions`. Applications appear in
Netlify under **Forms**. To receive an email for each one, open
**Forms, Form notifications, Add notification, Email notification**.

## Things to confirm before launch
- School email address and phone number (footer, top bar and the email/WhatsApp buttons on the admissions form).
- Term dates in the academic calendar (`TERMS` in the script).
