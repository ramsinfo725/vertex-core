const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const INPUT_DIR = path.join(__dirname, 'input_pdfs');
const OUTPUT_FILE = path.join(__dirname, 'final_report.xlsx');

// Simple "Poor Man's PDF Reader"
// Extracts text between parentheses ( ) which is how simple PDFs store text
function extractTextFromPDF(buffer) {
    const raw = buffer.toString('latin1'); // Binary to string
    // Find text inside parentheses: (Text Here)
    const matches = raw.match(/\(([^)]+)\)/g); 
    if (matches) {
        return matches.map(m => m.slice(1, -1)).join("\n");
    }
    return "";
}

async function askGemini(text) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;

    const prompt = `
    Extract data from invoice text. Return JSON.
    Fields: InvoiceNumber, Date, VendorName, TotalAmount (number).
    Text: ${text.substring(0, 2000)}
    `;

    try {
        // Use the generic pointer which works for this key
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        if (!data.candidates || !data.candidates[0]) {
            console.error("AI No Candidates:", JSON.stringify(data));
            return null;
        }
        const raw = data.candidates[0].content.parts[0].text;
        const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (e) {
        console.error("AI Error:", e.message);
        return null;
    }
}

async function processAll() {
    console.log("🚀 Starting Simple Bot...");
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.pdf'));
    const rows = [];

    for (const file of files) {
        console.log(`Processing: ${file}...`);
        const buffer = fs.readFileSync(path.join(INPUT_DIR, file));
        const text = extractTextFromPDF(buffer);
        
        console.log(`  📄 Extracted Text: ${text.replace(/\n/g, ' ')}`);
        
        if (text.length < 5) {
            console.log("  ⚠️ Text too short (compressed PDF?). Skipping.");
            continue;
        }

        const extracted = await askGemini(text);
        if (extracted) {
            rows.push({ File: file, ...extracted });
            console.log(`  ✅ AI Success: ${extracted.TotalAmount}`);
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
