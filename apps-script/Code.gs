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
//
// ADMIN PASSWORD (required for editing):
//   Project Settings (gear icon) > Script Properties > Add property
//     Property: ADMIN_PASSWORD   Value: <your password>
//   The password lives ONLY here — never in the public repo or the browser.
//   After adding it (or editing this file) you MUST redeploy the web app:
//     Deploy > Manage deployments > (edit) > Version: New version > Deploy
// ============================================================

const SHEET_ID = '1vqvY2ATGPxr3iEv8xhbdPmSrtzUxSva9-m7j77Vt0Q8'

// Reads the admin password from Script Properties (not stored in this file).
function getAdminPassword() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD') || ''
}

// True only when a correct password is supplied. If no password has been
// configured yet, all writes are refused (fail closed) rather than left open.
function isAuthed(payload) {
  const expected = getAdminPassword()
  if (!expected) return false
  return String(payload && payload.password || '') === expected
}

function doGet() {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const staff = readSheet(ss, 'Staff', ['name', 'role'])
  const jobs  = readSheet(ss, 'Jobs',  ['ref', 'site', 'type', 'foreman', 'active'])
  const alloc = dedupeByName(readSheet(ss, 'Allocations', ['name', 'bucket']))
  const dailyLog = readDailyLog(ss)
  return json({ staff, jobs, allocations: alloc, dailyLog })
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents)

  // Login check — verify the password without touching the sheet.
  if (payload.action === 'login') {
    return json({ ok: isAuthed(payload) })
  }

  // Every write below requires a valid password (verified server-side).
  if (!isAuthed(payload)) {
    return json({ ok: false, error: 'unauthorized' })
  }

  const ss = SpreadsheetApp.openById(SHEET_ID)

  if (payload.action === 'addJob') {
    const sheet = ss.getSheetByName('Jobs')
    sheet.appendRow([payload.ref, payload.site, payload.type || '', payload.foreman || '', ''])
    return json({ ok: true })
  }

  if (payload.action === 'deleteJob') {
    const sheet = ss.getSheetByName('Jobs')
    const data = sheet.getDataRange().getValues()
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim() === payload.ref) {
        sheet.deleteRow(i + 1)
        break
      }
    }
    return json({ ok: true })
  }

  // Default: save allocations
  const { allocations } = payload
  const sheet = ss.getSheetByName('Allocations')
  const unique = dedupeByName(allocations)
  // Overwrite the whole tab in one shot (clearContents + single setValues)
  // so duplicate rows can never accumulate, even across concurrent saves.
  sheet.clearContents()
  const rows = [['name', 'bucket']].concat(unique.map(a => [a.name, a.bucket]))
  sheet.getRange(1, 1, rows.length, 2).setValues(rows)
  return json({ ok: true })
}

// Keep the last bucket seen for each name, preserving first-seen order.
function dedupeByName(allocations) {
  const seen = {}
  const order = []
  ;(allocations || []).forEach(a => {
    const name = String(a.name || '').trim()
    if (!name) return
    if (!(name in seen)) order.push(name)
    seen[name] = String(a.bucket || '').trim()
  })
  return order.map(name => ({ name, bucket: seen[name] }))
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

// Read the Daily Log tab (Date, Name, Job / Bucket) for the hours dashboard.
function readDailyLog(ss) {
  const sheet = ss.getSheetByName('Daily Log')
  if (!sheet) return []
  const rows = sheet.getDataRange().getValues()
  if (rows.length < 2) return []
  return rows.slice(1).map(row => ({
    date:  row[0] instanceof Date
             ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd')
             : String(row[0] || '').trim(),
    name:  String(row[1] || '').trim(),
    label: String(row[2] || '').trim()
  })).filter(r => r.date && r.name)
}

function json(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}

// ============================================================
// DAILY SNAPSHOT — runs automatically at 7am via time-driven trigger
// To test immediately: select snapshotAllocations in the dropdown and click Run
// ============================================================

function snapshotAllocations() {
  const ss = SpreadsheetApp.openById(SHEET_ID)

  let log = ss.getSheetByName('Daily Log')
  if (!log) {
    log = ss.insertSheet('Daily Log')
    log.appendRow(['Date', 'Name', 'Job / Bucket'])
    log.getRange(1, 1, 1, 3).setFontWeight('bold')
  }

  const alloc = readSheet(ss, 'Allocations', ['name', 'bucket'])
  const jobs  = readSheet(ss, 'Jobs', ['ref', 'site', 'type', 'foreman', 'active'])
  const jobMap = {}
  jobs.forEach(j => { jobMap[j.ref] = j.site ? j.ref + ' — ' + j.site : j.ref })

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')

  alloc.forEach(a => {
    const label = jobMap[a.bucket] || a.bucket
    log.appendRow([today, a.name, label])
  })
}
