import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const INPUT_DIR = path.join(__dirname, 'input_pdfs');
const OUTPUT_FILE = path.join(__dirname, 'final_report.xlsx');

async function askGemini(text) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;

    const prompt = `
    Extract data from invoice. Return JSON.
    Fields: InvoiceNumber, Date, VendorName, TotalAmount (number).
    Text: ${text.substring(0, 2000)}
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const raw = data.candidates[0].content.parts[0].text;
        const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (e) {
        return null;
    }
}

async function processAll() {
    console.log("🚀 Starting Bulk Processor (ESM)...");
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.pdf'));
    const rows = [];

    for (const file of files) {
        console.log(`Processing: ${file}...`);
        const buffer = fs.readFileSync(path.join(INPUT_DIR, file));
        
        try {
            const data = await pdf(buffer);
            console.log(`  📄 Read ${data.text.length} chars.`);
            
            const extracted = await askGemini(data.text);
            if (extracted) {
                rows.push({ File: file, ...extracted });
                console.log(`  ✅ Extracted: ${extracted.TotalAmount}`);
            }
        } catch (e) {
            console.error(`  ❌ Failed: ${e.message}`);
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
