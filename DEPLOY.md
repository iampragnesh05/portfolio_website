# Deploy: Google Sheet + Netlify

This guide covers (1) saving the contact form to a Google Sheet and (2) hosting the site on Netlify.

---

## 1. Save contact form to Google Sheet

### Step 1: Create the sheet and script

1. Go to [Google Sheets](https://sheets.google.com) and create a **new spreadsheet** (e.g. "Portfolio contact form").
2. In the sheet menu: **Extensions → Apps Script**.
3. Delete any sample code in the editor.
4. Open the file `google-apps-script/ContactFormToSheet.gs` in this project, copy its full contents, and paste into the Apps Script editor.
5. If your sheet’s first tab is not named **Sheet1**, change the `sheetName` inside `getSheet()` to match your tab name.
6. Click **Save** (💾). Name the project if asked (e.g. "Contact Form to Sheet").

### Step 2: Deploy as web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** e.g. "Contact form endpoint"
   - **Execute as:** Me (your Google account)
   - **Who has access:** **Anyone** (so the Netlify site can send submissions)
4. Click **Deploy**.
5. If asked, **Authorize** the app: choose your Google account and allow the requested permissions.
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/xxxxx/exec`).

### Step 3: Connect the form to the script

1. In your project, open **index.html**.
2. Find the contact form and set the script URL in the `data-submit-url` attribute:

```html
<form class="contact-form" id="homeContactForm" data-submit-url="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec">
```

Replace `YOUR_SCRIPT_ID` (or the whole URL) with the Web app URL you copied.

3. Save the file. New submissions will be sent to the script and appended as rows in your Google Sheet.

**Sheet columns:** Timestamp, Full Name, Email, Phone, Project Type, Budget, Timeline, Website, Message. The script adds the header row automatically if the sheet is empty.

### Second form – Shopify consultation (different Sheet)

To save **Shopify-storefront.html** consultation form submissions in a **separate** Google Sheet:

1. Create a **new** Google Sheet (e.g. "Shopify consultation form").
2. **Extensions → Apps Script**. Delete sample code and paste the **same** code from `google-apps-script/ContactFormToSheet.gs` (same file as above).
3. Save, then **Deploy → New deployment → Web app** (Execute as: **Me**, Who has access: **Anyone**). Deploy and copy the **new** Web app URL.
4. In your project, open **Shopify-storefront.html** and find the consultation form. Paste that URL into the `data-submit-url` attribute:
   ```html
   <form ... id="shopifyConsultForm" ... data-submit-url="https://script.google.com/macros/s/YOUR_NEW_ID/exec">
   ```

Submissions from the Shopify page will go to this second sheet only. The home contact form continues to use its own URL and sheet.

### Third form – WordPress inquiry (different Sheet)

To save **wordpress-store.html** inquiry form submissions in a **separate** Google Sheet:

1. Create a **new** Google Sheet (e.g. "WordPress inquiry form").
2. **Extensions → Apps Script**. Delete sample code and paste the **same** code from `google-apps-script/ContactFormToSheet.gs`.
3. Save, then **Deploy → New deployment → Web app** (Execute as: **Me**, Who has access: **Anyone**). Copy the **new** Web app URL.
4. In **wordpress-store.html**, find the form `id="wp-inquiry-form"` and set its `data-submit-url` to that URL:
   ```html
   <form ... id="wp-inquiry-form" ... data-submit-url="https://script.google.com/macros/s/YOUR_NEW_ID/exec">
   ```

WordPress form fields are mapped to the same columns: Full Name, Email, Phone, Project Type (website type + pages), Budget, Timeline, Website (reference URL), Message (description + company, domain/hosting, content ready). File uploads are not sent to the sheet.

---

## 2. Upload and host on Netlify

### Option A: Deploy with Git (recommended)

1. **Put the project in a Git repo** (e.g. on GitHub):
   - Create a new repository on GitHub.
   - In your project folder run:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
     git push -u origin main
     ```
2. **Connect to Netlify:**
   - Go to [Netlify](https://www.netlify.com) and sign in (or create an account).
   - Click **Add new site → Import an existing project**.
   - Choose **GitHub** and authorize Netlify. Select the repository you just pushed.
3. **Build settings** (static site, no build step):
   - **Build command:** leave empty, or `echo "No build"`
   - **Publish directory:** `.` (root) or leave default if it’s already the repo root.
4. Click **Deploy site**. Netlify will build and give you a URL like `https://random-name-123.netlify.app`.
5. **Optional:** In **Site settings → Domain management** you can add a custom domain or change the site name.

After deployment, open the Netlify URL and test the contact form. Submissions should appear in your Google Sheet.

### Option B: Deploy by drag-and-drop

1. Go to [Netlify](https://app.netlify.com).
2. Drag your **project folder** (the one containing `index.html`, `css/`, `js/`, etc.) into the Netlify drop zone.
3. Netlify will publish the site and give you a live URL.

Make sure you’ve already set `data-submit-url` in `index.html` to your Google Apps Script Web app URL so the form works on the live site.

---

## Troubleshooting

- **Form shows "Configure form URL"**  
  You haven’t set `data-submit-url` on the form in `index.html`, or the value is empty. Set it to your full Apps Script Web app URL.

- **"Could not send" or CORS errors**  
  Ensure the Apps Script is deployed as **Web app** with **Who has access: Anyone**. If you still see CORS errors, the script may be in a region that doesn’t send CORS headers; the POST can still succeed—check the Google Sheet for new rows.

- **Netlify 404 on pages**  
  For multiple HTML files (e.g. `personal.html`, `contact.html`), Netlify serves them as-is. Use links like `https://yoursite.netlify.app/personal.html`. For pretty URLs without `.html`, you can add a `_redirects` file or use Netlify’s redirects in the dashboard.

- **Changes not showing on Netlify**  
  If you use Git: push your changes; Netlify will redeploy. If you used drag-and-drop, drag the folder again to trigger a new deploy.
