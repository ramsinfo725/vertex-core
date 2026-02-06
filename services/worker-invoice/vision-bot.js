const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const INPUT_DIR = path.join(__dirname, 'input_pdfs');
const OUTPUT_FILE = path.join(__dirname, 'final_report.xlsx');

async function askGeminiVision(filePath) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;

    const base64Data = fs.readFileSync(filePath).toString('base64');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`;

    const prompt = `
    You are an Invoice Extraction Bot.
    Analyze this document. It may contain ONE or MULTIPLE invoices.
    Extract data for EVERY invoice found.
    
    Return ONLY valid JSON as a LIST of objects.
    Fields per object: 
    - InvoiceNumber (string)
    - Date (YYYY-MM-DD)
    - VendorName (string)
    - TotalAmount (number)
    - LineItems (count)
    `;

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { inline_data: { mime_type: "application/pdf", data: base64Data } }
            ]
        }]
    };

    try {
        console.log("  👀 Uploading to Gemini...");
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("  ⚠️ Google Error:", await response.text());
            return null;
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);

    } catch (e) {
        console.error("  ❌ AI Error:", e.message);
        return null;
    }
}

async function processAll() {
    console.log("🚀 Starting Vision Bot (Multi-Invoice Support)...");
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.pdf'));
    const rows = [];

    for (const file of files) {
        console.log(`Processing: ${file}...`);
        const extracted = await askGeminiVision(path.join(INPUT_DIR, file));
        
        if (extracted) {
            // Check if array or object
            if (Array.isArray(extracted)) {
                console.log(`  ✅ Found ${extracted.length} invoices.`);
                extracted.forEach(inv => rows.push({ File: file, ...inv }));
            } else {
                rows.push({ File: file, ...extracted });
                console.log(`  ✅ Success: ${extracted.TotalAmount}`);
            }
        } else {
            console.log("  ❌ Failed.");
        }

        // DELAY 15s
        if (files.indexOf(file) < files.length - 1) {
            console.log("  ⏳ Cooling down (15s)...");
            await new Promise(r => setTimeout(r, 15000));
        }
    }

    if (rows.length > 0) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, OUTPUT_FILE);
        console.log(`🎉 Saved ${rows.length} records to final_report.xlsx`);
    }
}

processAll();
