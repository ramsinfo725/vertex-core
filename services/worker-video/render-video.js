const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static'); // Lazy Way
const path = require('path');
const fs = require('fs');

// Use the static binary
ffmpeg.setFfmpegPath(ffmpegPath); 

const ASSETS_DIR = path.join(__dirname, 'assets');
const OUTPUT_FILE = path.join(__dirname, 'final_video.mp4');

async function render() {
    console.log("🎬 Starting Video Render...");
    
    // 1. Get Assets
    const audio = path.join(ASSETS_DIR, 'voiceover.mp3');
    const clips = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.mp4')).map(f => path.join(ASSETS_DIR, f));

    if (clips.length === 0) return console.error("❌ No video clips found!");

    // 2. Build FFmpeg Command
    let command = ffmpeg();

    // Input all clips
    clips.forEach(clip => command.input(clip));
    
    // Input Audio
    command.input(audio);

    // Filter Logic: Concatenate videos, scale to 1080x1920 (Vertical for Shorts)
    // Complex filter graph needed for robust stitching
    // For MVP: Just use the first clip + audio
    
    console.log(`Rendering using: ${clips[0]} + ${audio}`);

    ffmpeg(clips[0])
        .input(audio)
        .outputOptions([
            '-c:v libx264',   // Video Codec
            '-c:a aac',       // Audio Codec
            '-shortest',      // Cut video to audio length
            '-map 0:v:0',     // Map First Video
            '-map 1:a:0'      // Map First Audio
        ])
        .save(OUTPUT_FILE)
        .on('start', (cmd) => console.log('Spawned Ffmpeg with command: ' + cmd))
        .on('error', (err) => console.error('An error occurred: ' + err.message))
        .on('end', () => console.log('🎉 Processing finished! Video saved to final_video.mp4'));
}

render();
