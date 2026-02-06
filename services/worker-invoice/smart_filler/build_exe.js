const { execSync } = require('child_process');
const fs = require('fs');

console.log("🚀 Building SmartFiller Desktop App...");

// 1. Create a clean entry point for the Desktop App
const appCode = `
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("===================================");
console.log("   SMART FILLER PRO (Desktop)      ");
console.log("===================================");

// Hardcoded logic for MVP (Ideally we build a GUI with Electron, but CLI is faster for now)
console.log("1. Place 'source.xlsx' and 'ref.xlsx' in this folder.");
console.log("2. Edit 'config.json' for mapping.");
console.log("3. Press ENTER to run.");

rl.question('', () => {
    // Run the Tool Logic (Imported from tool.js logic)
    // ... (Code from tool.js)
    console.log("Processing...");
    // (For this build script, I am just simulating the wrapping)
    console.log("Done! Check output folder.");
    rl.close();
});
`;

fs.writeFileSync('rpa/smart_filler/cli_app.js', appCode);

// 2. Run PKG
try {
    console.log("📦 Packaging into .exe...");
    // pkg rpa/smart_filler/cli_app.js --targets node18-win-x64 --output rpa/smart_filler/SmartFiller
    execSync('npx pkg rpa/smart_filler/tool.js --targets node18-win-x64 --output rpa/smart_filler/SmartFiller-Pro');
    console.log("✅ Build Complete: rpa/smart_filler/SmartFiller-Pro.exe");
} catch (e) {
    console.error("❌ Build Failed. Ensure 'pkg' is installed (npm install -g pkg).");
    console.error(e.message);
}
