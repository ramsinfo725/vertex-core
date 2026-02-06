const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Ensure directories exist
if (!fs.existsSync(INPUT_DIR)) fs.mkdirSync(INPUT_DIR);
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

function runSmartFiller() {
    console.log("🚀 Starting Smart Filler...");

    // 1. Load Config
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error("❌ config.json not found!");
        return;
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    console.log(`📋 Config Loaded: Mapping ${Object.keys(config.mapping).length} columns.`);

    // 2. Load Source File
    const sourcePath = path.join(INPUT_DIR, 'source.xlsx');
    if (!fs.existsSync(sourcePath)) {
        console.error("❌ source.xlsx not found in input folder!");
        return;
    }
    const sourceWb = XLSX.readFile(sourcePath);
    const sourceSheet = sourceWb.Sheets[sourceWb.SheetNames[0]];
    const sourceData = XLSX.utils.sheet_to_json(sourceSheet);
    console.log(`📄 Read ${sourceData.length} rows from Source.`);

    // 3. Process Rows
    const resultRows = [];
    const errors = [];

    sourceData.forEach((row, index) => {
        const rowNum = index + 2; // Excel row number (1-header)
        const newRow = {};
        let rowValid = true;

        // Map Fields
        for (const [targetCol, sourceCol] of Object.entries(config.mapping)) {
            let value = row[sourceCol];

            // Mandatory Check
            if (config.mandatory.includes(targetCol)) {
                if (value === undefined || value === null || value === '') {
                    errors.push(`Row ${rowNum}: Missing mandatory field '${targetCol}' (Mapped from '${sourceCol}')`);
                    rowValid = false;
                }
            }

            newRow[targetCol] = value;
        }

        if (rowValid) {
            resultRows.push(newRow);
        }
    });

    // 4. Output Results
    if (resultRows.length > 0) {
        const newWb = XLSX.utils.book_new();
        const newWs = XLSX.utils.json_to_sheet(resultRows);
        XLSX.utils.book_append_sheet(newWb, newWs, "Filled Data");
        XLSX.writeFile(newWb, path.join(OUTPUT_DIR, 'filled_result.xlsx'));
        console.log(`✅ Success! Generated 'filled_result.xlsx' with ${resultRows.length} rows.`);
    }

    // 5. Output Errors
    if (errors.length > 0) {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'errors.txt'), errors.join('\n'));
        console.log(`⚠️ Found ${errors.length} data issues. Check 'output/errors.txt'.`);
    } else {
        console.log("✨ Data Quality: Perfect. No missing fields.");
    }
}

runSmartFiller();
