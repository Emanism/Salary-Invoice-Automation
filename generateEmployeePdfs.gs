/**
 * CONFIGURATION — paste in your IDs here
 */
const SPREADSHEET_ID   = '1tda7UagSt23shQL-R6GkNnkv0oQjNiKZ7gWyBhCtaBM';
const SHEET_NAME       = 'Sheet1';
const DOC_TEMPLATE_ID  = '1eEwTFxzVZfP-hgP4Xqot-Z_n4A3wA6FuHtTy8AxoOt4';
// If all employee folders live under one folder, set it here,
// otherwise leave blank to search your entire Drive by folder name.
const PARENT_FOLDER_ID = '1W0Cz3-00ZHLa1LJdRKkqux-VgvIEh5sI';

function generateEmployeePdfs() {
  // 1) Load sheet
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();  // e.g. ["Employee Name","Employee ID",…,"Net Salary (PKR)","Paid Days"]

  data.forEach((row, idx) => {
    const rowNum = idx + 2;
    // Build record map
    const record = {};
    headers.forEach((h, i) => record[h] = row[i]);

    const name = record['Employee Name'];
    const id   = record['Employee ID'];
    if (!name || !id) {
      Logger.log(`Skipping row ${rowNum}: missing Name or ID`);
      return;
    }
    const folderName = `${name} - ${id}`;

    // 2) Copy & open the Google Doc template
    const tempFile = DriveApp
      .getFileById(DOC_TEMPLATE_ID)
      .makeCopy(`TMP_${folderName}`);
    const doc  = DocumentApp.openById(tempFile.getId());
    const body = doc.getBody();

    // 3) Merge each placeholder by building a STRING regex
    headers.forEach(h => {
      // escape regex chars in header:
      const safe  = h.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      // build a string-regex matching literally {{Header}}
      const pattern = '\\{\\{' + safe + '\\}\\}';
      const value   = (record[h] != null && record[h] !== '') ? record[h] : '–';
      body.replaceText(pattern, value);
    });

    // 4) Final cleanup: any leftover {{…}} → dash
    body.replaceText('\\{\\{[^}]+\\}\\}', '–');

    doc.saveAndClose();

    // 5) Export as PDF
    const pdfBlob = tempFile
      .getAs(MimeType.PDF)
      .setName(`${folderName}.pdf`);

    // 6) Drop into the correct Drive folder
    const parent = PARENT_FOLDER_ID
      ? DriveApp.getFolderById(PARENT_FOLDER_ID)
      : DriveApp;
    const folders = parent.getFoldersByName(folderName);
    if (!folders.hasNext()) {
      throw new Error(`Folder not found: "${folderName}"`);
    }
    folders.next().createFile(pdfBlob);

    // 7) Clean up
    tempFile.setTrashed(true);
  });
}