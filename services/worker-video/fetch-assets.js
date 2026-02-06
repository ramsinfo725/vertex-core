const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const SCRIPT_PATH = path.join(__dirname, 'script.txt');
const ASSETS_DIR = path.join(__dirname, 'assets');

// Mock Pexels API response URLs (Google samples)
const MOCK_VIDEOS = [
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
];

async function main() {
    // 1. Read script.txt
    console.log('Reading script.txt...');
    if (!fs.existsSync(SCRIPT_PATH)) {
        console.error('script.txt not found!');
        process.exit(1);
    }
    const scriptContent = fs.readFileSync(SCRIPT_PATH, 'utf-8');

    // 2. Extract 5 keywords
    console.log('Extracting keywords...');
    const keywords = extractKeywords(scriptContent, 5);
    console.log('Keywords found:', keywords);

    // Ensure assets directory exists
    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR);
        console.log('Created assets directory.');
    }

    // 3 & 4. Find and download 3 clips
    console.log('Fetching and downloading clips...');
    const numClips = 3;
    
    for (let i = 0; i < numClips; i++) {
        // Cycle through keywords if fewer than 3, or pick specific ones
        const keyword = keywords[i % keywords.length] || 'video'; 
        const videoUrl = await searchPexels(keyword, i);
        
        if (videoUrl) {
            const fileName = `video_${i + 1}.mp4`;
            const filePath = path.join(ASSETS_DIR, fileName);
            await downloadVideo(videoUrl, filePath);
        } else {
            console.log(`No video found for keyword: ${keyword}`);
        }
    }
    
    console.log('Done!');
}

function extractKeywords(text, count) {
    // Simple extraction: split, remove punctuation, filter short words, unique, take top N
    const words = text.toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 4) // Filter out short words
        .filter(w => !['about', 'actually', 'their', 'there', 'where', 'which', 'would', 'could', 'should', 'these', 'those'].includes(w));
    
    // Frequency count
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    
    // Sort by frequency desc
    const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
    
    // If not enough words, pad with original list (unique)
    const unique = [...new Set(words)];
    
    // Combine freq sorted with any others needed to fill count
    const result = [];
    const seen = new Set();
    
    for (const w of sorted) {
        if (result.length >= count) break;
        if (!seen.has(w)) {
            result.push(w);
            seen.add(w);
        }
    }
    
    return result;
}

async function searchPexels(keyword, index) {
    const apiKey = process.env.PEXELS_API_KEY;
    
    if (apiKey && apiKey !== 'PLACEHOLDER') {
        try {
            console.log(`Searching Pexels for: ${keyword}`);
            const response = await axios.get(`https://api.pexels.com/videos/search`, {
                params: { query: keyword, per_page: 1, orientation: 'landscape' },
                headers: { Authorization: apiKey }
            });
            
            if (response.data.videos && response.data.videos.length > 0) {
                // Get the first video file that is hd or sd
                const videoFiles = response.data.videos[0].video_files;
                // Sort by width to get decent quality but not massive
                videoFiles.sort((a, b) => b.width - a.width);
                const bestFile = videoFiles.find(f => f.quality === 'hd') || videoFiles[0];
                return bestFile.link;
            } else {
                console.log(`No results for ${keyword} on Pexels.`);
            }
        } catch (error) {
            console.error(`Pexels API error: ${error.message}. Falling back to mock.`);
        }
    } else {
        console.log(`Using mock search for: ${keyword}`);
    }
    
    // Fallback/Mock
    return MOCK_VIDEOS[index % MOCK_VIDEOS.length];
}

async function downloadVideo(url, filePath) {
    console.log(`Downloading to ${path.basename(filePath)}...`);
    try {
        const writer = fs.createWriteStream(filePath);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Saved ${path.basename(filePath)}`);
                resolve();
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
    }
}

main();
