// ============================================================
// LGH Job Board — Google Apps Script
// ============================================================
// SETUP:
// 1. Open your Google Sheet
// 2. Extensions > Apps Script > paste this entire file
// 3. Replace YOUR_SHEET_ID below with your sheet's ID
//    (it's the long string in the sheet URL between /d/ and /edit)
// 4. Deploy > New deployment > Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the web app URL and paste it in src/config/api.js
// ============================================================

const SHEET_ID = 'YOUR_SHEET_ID'

function doGet() {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const staff = readSheet(ss, 'Staff', ['name', 'role'])
  const jobs  = readSheet(ss, 'Jobs',  ['ref', 'site', 'type', 'foreman', 'active'])
  const alloc = readSheet(ss, 'Allocations', ['name', 'bucket'])
  const output = ContentService.createTextOutput(JSON.stringify({ staff, jobs, allocations: alloc }))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}

function doPost(e) {
  const { allocations } = JSON.parse(e.postData.contents)
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Allocations')
  sheet.clearContents()
  sheet.appendRow(['name', 'bucket'])
  allocations.forEach(a => sheet.appendRow([a.name, a.bucket]))
  const output = ContentService.createTextOutput(JSON.stringify({ ok: true }))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}

function readSheet(ss, tabName, keys) {
  const sheet = ss.getSheetByName(tabName)
  if (!sheet) return []
  const rows = sheet.getDataRange().getValues()
  if (rows.length < 2) return []
  return rows.slice(1).map(row => {
    const obj = {}
    keys.forEach((k, i) => { obj[k] = String(row[i] || '').trim() })
    return obj
  }).filter(r => r[keys[0]])
}

// ============================================================
// GOOGLE SHEET STRUCTURE:
//
// Tab: Staff
//   Column A: name        (e.g. "Tom Briggs")
//   Column B: role        (e.g. "Groundworker")
//
// Tab: Jobs
//   Column A: ref         (e.g. "JOB-001")
//   Column B: site        (e.g. "Forest Valley Court")
//   Column C: type        (e.g. "Groundworks")
//   Column D: foreman     (e.g. "Sarah Kent")
//   Column E: active      (type "yes" to show, "no" to hide)
//
// Tab: Allocations
//   Column A: name        (matches a name from Staff tab)
//   Column B: bucket      (job ref, or: leave / other / unassigned)
// ============================================================
