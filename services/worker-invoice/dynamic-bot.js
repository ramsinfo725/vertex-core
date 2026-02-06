const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const INPUT_DIR = path.join(__dirname, 'input_pdfs');
const OUTPUT_FILE = path.join(__dirname, 'final_report.xlsx');
const CONFIG_FILE = path.join(__dirname, 'config.json');

async function askGeminiVision(filePath, fields) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;

    const base64Data = fs.readFileSync(filePath).toString('base64');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`;

    const prompt = `
    You are a Data Extraction Specialist.
    Extract the following fields from this document: ${fields.join(", ")}.
    
    Return strict JSON format with keys matching the requested fields.
    If a field is missing, set it to "N/A".
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
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) return null;

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);

    } catch (e) {
        return null;
    }
}

async function processAll() {
    console.log("🚀 Starting Dynamic Bot...");
    
    // Read Config
    let fields = ["Total Amount"];
    if (fs.existsSync(CONFIG_FILE)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        fields = config.fields;
        console.log(`📋 Extracting: ${fields.join(", ")}`);
    }

    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.pdf'));
    const rows = [];

    for (const file of files) {
        console.log(`Processing: ${file}...`);
        const extracted = await askGeminiVision(path.join(INPUT_DIR, file), fields);
        
        if (extracted) {
            rows.push({ File: file, ...extracted });
            console.log(`  ✅ Extracted.`);
        } else {
            console.log("  ❌ Failed.");
        }

        // Delay
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
        console.log(`🎉 Saved to final_report.xlsx`);
    }
}

processAll();
