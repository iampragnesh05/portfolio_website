/**
 * Contact Form to Google Sheet
 * Deploy this as a Web App to receive form submissions from your portfolio site.
 *
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new Google Sheet.
 * 2. Go to Extensions > Apps Script. Delete any sample code.
 * 3. Paste this entire file into the editor.
 * 4. Replace 'YOUR_SHEET_NAME' below with your sheet's tab name (default is usually "Sheet1").
 * 5. Click Save (disk icon). Give the project a name if prompted.
 * 6. Click Deploy > New deployment. Type: Web app.
 *    - Description: "Contact form endpoint"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Click Deploy. Authorize when asked (choose your Google account, allow permissions).
 * 8. Copy the "Web app URL" and use it in your site (see home.js or form's data-submit-url).
 */

/**
 * Handle CORS preflight (OPTIONS) so fetch() from your site works.
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = getSheet();
    // Support both JSON (fetch) and form-urlencoded (form POST in iframe)
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (_) {
        data = {};
      }
    }
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = {
        name: e.parameter.name || '',
        email: e.parameter.email || '',
        phone: e.parameter.phone || '',
        projectType: e.parameter.projectType || '',
        budget: e.parameter.budget || '',
        timeline: e.parameter.timeline || '',
        website: e.parameter.website || '',
        message: e.parameter.message || ''
      };
    }
    
    const row = [
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.projectType || '',
      data.budget || '',
      data.timeline || '',
      data.website || '',
      data.message || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Saved' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: GET request for CORS / testing.
 * Your form uses POST; this is only for checking that the script is live.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Contact form endpoint is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'Sheet1'; // Change to your tab name if different
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
  }
  
  // Add headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'Project Type',
      'Budget',
      'Timeline',
      'Website',
      'Message'
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }
  
  return sheet;
}
