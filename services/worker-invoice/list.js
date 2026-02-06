async function list() {
    const key = process.env.GEMINI_API_KEY;
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await resp.json();
    console.log(data.models.map(m => m.name));
}
require('dotenv').config({ path: 'rpa/.env' });
list();
