require('dotenv').config();
const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');
const { OpenAI } = require('openai');

const topic = process.argv[2] || 'The Future of AI';

async function generateViralScript(topic) {
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a viral YouTube script writer." }, { role: "user", content: `Write a short, engaging, viral script about ${topic}. Keep it under 500 characters.` }],
        model: "gpt-3.5-turbo",
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI Error:", error.message);
      console.log("Falling back to template script...");
    }
  }
  return `Hey guys! Welcome back to the channel. Today we're talking about ${topic}. You won't believe how crazy ${topic} actually is! Did you know it changes everything we know about the world? Make sure to smash that like button and subscribe for more mind-blowing facts about ${topic}! See you in the next one!`;
}

async function main() {
  console.log(`Generating script for topic: "${topic}"...`);
  const script = await generateViralScript(topic);
  
  console.log("Script generated:");
  console.log(script);
  
  fs.writeFileSync('script.txt', script);
  console.log("Saved to script.txt");

  console.log("Generating audio...");
  
  try {
    const results = await googleTTS.getAllAudioBase64(script, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
      splitPunct: '.!?'
    });
    
    // Concatenate base64 strings
    const buffers = results.map(result => Buffer.from(result.base64, 'base64'));
    const finalBuffer = Buffer.concat(buffers);
    
    fs.writeFileSync('voiceover.mp3', finalBuffer);
    console.log("Saved to voiceover.mp3");
    
  } catch (error) {
    console.error("TTS Error:", error);
  }
}

main();
