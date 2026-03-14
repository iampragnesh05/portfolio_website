# Deploy Your Static Website with GitHub + Netlify (Free)

This guide walks you through putting your static site (HTML, CSS, JS) on GitHub and having Netlify deploy it automatically. No build step required.

---

## Part 1: Put Your Site on GitHub

### Step 1: Create a GitHub account (if needed)

1. Go to [github.com](https://github.com) and sign up (or sign in).
2. Confirm your email if prompted.

### Step 2: Create a new repository

1. Click the **+** in the top-right → **New repository**.
2. Fill in:
   - **Repository name:** e.g. `portfolio-website` (use letters, numbers, hyphens).
   - **Description:** optional (e.g. "My portfolio static site").
   - **Public**.
   - **Do not** check "Add a README", ".gitignore", or "license" (you already have files).
3. Click **Create repository**.

You’ll see a page with setup instructions; keep it open for the next step.

### Step 3: Upload your project files with Git

Open **PowerShell** (or Command Prompt) and go to your project folder:

```powershell
cd "c:\Users\iampr\Desktop\portfolio website"
```

If Git is not installed, download it from [git-scm.com](https://git-scm.com/download/win) and run the installer, then reopen PowerShell.

Run these commands one by one (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name):

```powershell
git init
git add .
git commit -m "Initial commit: portfolio static site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

- When prompted, sign in to GitHub (browser or token).
- After `git push`, your files will be on GitHub. Refresh the repository page to see them.

---

## Part 2: Deploy on Netlify from GitHub

### Step 4: Sign in to Netlify

1. Go to [netlify.com](https://www.netlify.com).
2. Click **Sign up** or **Log in**.
3. Choose **Sign up with GitHub** (or **Log in with GitHub**) and authorize Netlify.

### Step 5: Import your GitHub repository

1. In Netlify, click **Add new site** → **Import an existing project**.
2. Click **Deploy with GitHub**.
3. If asked, authorize Netlify to access your GitHub account and choose your account or organization.
4. Find your repository (e.g. `portfolio-website`) in the list and click **Import**.

### Step 6: Configure build settings (important for static sites)

On the “Set up and deploy” screen, use these settings:

| Setting            | Value        | Why |
|--------------------|-------------|-----|
| **Branch to deploy** | `main`      | Your code is on `main`. |
| **Build command**    | *(leave empty)* or `echo "No build"` | No build step for plain HTML/CSS/JS. |
| **Publish directory** | `.`         | Site root is the repo root (where `index.html` is). |

- **Build command:** Leave blank so Netlify doesn’t run a build. Optionally set to `echo "No build"` if the UI requires something.
- **Publish directory:** Must be `.` so Netlify serves `index.html`, `css/`, `js/`, `Image/`, and all HTML files from the root.

Click **Deploy site**.

### Step 7: Get your live URL

1. Netlify will build and deploy (usually under a minute).
2. When it’s done, you’ll see **Site is live** and a link like:
   - `https://random-words-123.netlify.app`
3. Click the link to open your site.

**Optional:** In **Site settings → Domain management → Options → Edit site name** you can change `random-words-123` to something like `my-portfolio` so the URL becomes `https://my-portfolio.netlify.app`.

---

## Part 3: Updating Your Website Later

Any time you change your site locally and want the live site to update:

1. Save your files in your project folder.
2. In PowerShell (in that folder), run:

```powershell
git add .
git commit -m "Describe your change (e.g. Update homepage, fix contact form)"
git push
```

3. Netlify will detect the push and start a new deploy (usually 1–2 minutes).
4. When the deploy finishes, refresh your Netlify URL to see the changes.

No need to drag-and-drop or log into Netlify each time; push to GitHub and Netlify deploys automatically.

---

## Summary: Settings for Your Static Site

| Item                | Recommended value |
|---------------------|-------------------|
| Build command       | *(empty)* or `echo "No build"` |
| Publish directory   | `.`               |
| Branch              | `main`            |
| Node version        | Not needed        |
| Environment variables | Only if you add serverless/API features later |

Your project layout (e.g. `index.html`, `personal.html`, `css/`, `js/`, `Image/`) is already correct for publish directory `.`.

---

## Quick reference

- **Create repo:** GitHub → New repository → no README/.gitignore.
- **Upload:** `git init` → `git add .` → `git commit -m "..."` → `git remote add origin ...` → `git push -u origin main`.
- **Deploy:** Netlify → Add new site → Import from GitHub → choose repo → Build command: empty, Publish directory: `.` → Deploy.
- **Live URL:** Shown after deploy; can rename in Site settings.
- **Update site:** Edit files → `git add .` → `git commit -m "..."` → `git push`; Netlify auto-deploys.

If you also use the contact form and Google Sheets, see **DEPLOY.md** in this project for setting the form submission URL and hosting together.
