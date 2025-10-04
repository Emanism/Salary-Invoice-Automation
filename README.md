# Salary Invoice Processing Automation

This Google Apps Script automates the generation of personalized salary invoices for employees by merging data from a Google Sheet into a Google Doc template, exporting each as a PDF, and filing the result into each employee’s specific folder on Google Drive.

---

## Features

- **Sheet-to-Doc/PDF Merge:** Reads salary and employee data from a Google Sheet and fills a Google Doc template for each employee.
- **Dynamic Placeholder Replacement:** All `{{Header}}` placeholders in the template are replaced with matching data from the sheet.
- **PDF Export:** Each filled template is exported as a PDF file.
- **Automated Filing:** Each employee’s PDF is saved into their individual Google Drive folder, identified by name and employee ID.
- **Clean-up:** Temporary files are deleted after PDF generation.

---

## How It Works

1. **Data Source:**  
   - Employee salary data is maintained in a Google Sheet (e.g., columns like `Employee Name`, `Employee ID`, `Net Salary (PKR)`, etc.).
2. **Template:**  
   - You provide a Google Doc template with placeholders (e.g., `{{Employee Name}}`, `{{Net Salary (PKR)}}`).
3. **Script Execution:**  
   - For each row (employee) in the sheet:
     - A copy of the template is made.
     - All placeholders are filled with the relevant data.
     - The result is exported as a PDF.
     - The PDF is placed in the Google Drive folder named after the employee (format: `Employee Name - Employee ID`).
     - The temporary document is deleted.

---

## Configuration

Set the following IDs at the top of your script:

```js
const SPREADSHEET_ID   = 'your-spreadsheet-id';      // Your Google Sheet with payroll data
const SHEET_NAME       = 'Sheet1';                   // Sheet name (default: Sheet1)
const DOC_TEMPLATE_ID  = 'your-doc-template-id';     // Google Doc template with placeholders
const PARENT_FOLDER_ID = 'your-parent-folder-id';     // (Optional) Parent folder containing all employee folders
```

- **SPREADSHEET_ID:**  
  Get this from your Google Sheet URL:  
  `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`
- **DOC_TEMPLATE_ID:**  
  Get this from your template Doc URL:  
  `https://docs.google.com/document/d/<DOC_TEMPLATE_ID>/edit`
- **PARENT_FOLDER_ID:**  
  The Google Drive folder under which all employee folders reside (optional; leave blank to search all of Drive).

---

## Template Setup

- Your Doc template should use double curly braces for placeholders, e.g.:
  ```
  Invoice for: {{Employee Name}}
  Net Salary: {{Net Salary (PKR)}}
  ```
- Every header in your sheet should have a matching placeholder in the template.

---

## Employee Folders

- Each employee should have a folder in Drive named exactly as:  
  `Employee Name - Employee ID`
- The script will place each PDF in the correct folder. If a folder is missing, an error will be thrown.

---

## Running the Script

1. Paste the script into your [Google Apps Script](https://script.google.com/) editor.
2. Update the configuration variables.
3. Ensure you have the right permissions for Drive and Docs.
4. Run the `generateEmployeePdfs` function.

---

## Customization

- **Add or remove sheet/template columns** by updating the Sheet headers and matching placeholders in the Doc.
- **Change the naming convention** for folders or PDFs by editing the relevant lines in the script.

---

## Error Handling

- Rows with missing `Employee Name` or `Employee ID` are skipped.
- If a target employee folder doesn’t exist, the script throws an error for that row and continues.

---

## Troubleshooting

- **Script errors about permissions:**  
  - Make sure you have enabled Drive and Docs API permissions and authorized the script.
- **PDFs not appearing:**  
  - Check that employee folders are correctly named and exist under the parent folder.
- **Placeholders not replaced:**  
  - Ensure every Sheet header has a matching `{{Header}}` in the template.

---

## License

MIT License (or your company’s policy)

---

## Author

- Shahzadi Eman
- atomcamp
- Shahzadieman1122@gmail.com
