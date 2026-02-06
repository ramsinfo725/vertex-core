const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');

// Mock PDF Input (Since I don't have a real PDF file yet, I'll simulate reading one)
// In production, this would use fs.readFileSync('invoice.pdf')

async function runBot() {
    console.log("🤖 Invoice Bot Started...");

    // 1. Create a dummy PDF content simulation
    // (Real extracting requires a real PDF file path)
    const mockInvoiceText = `
    INVOICE #1024
    Date: 2026-02-02
    Vendor: Amazon Web Services
    Total: $52.40
    `;

    console.log("📄 Reading PDF...");
    // extractData(mockInvoiceText);
    
    // 2. Extract Data (Regex Logic)
    const invNum = mockInvoiceText.match(/INVOICE #(\d+)/)[1];
    const date = mockInvoiceText.match(/Date: ([\d-]+)/)[1];
    const amount = mockInvoiceText.match(/Total: \$([\d.]+)/)[1];

    console.log(`✅ Extracted: ${invNum} | ${date} | $${amount}`);

    // 3. Write to Excel
    const filePath = path.join(__dirname, 'report.xlsx');
    let workbook;
    let worksheet;

    if (fs.existsSync(filePath)) {
        console.log("📂 Opening existing Excel...");
        workbook = XLSX.readFile(filePath);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
        console.log("✨ Creating new Excel...");
        workbook = XLSX.utils.book_new();
        worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    }

    // Append Row
    const newRow = [{ "Invoice": invNum, "Date": date, "Amount": amount }];
    XLSX.utils.sheet_add_json(worksheet, newRow, { skipHeader: false, origin: -1 });

    XLSX.writeFile(workbook, filePath);
    console.log("💾 Saved to report.xlsx");
}

runBot();
