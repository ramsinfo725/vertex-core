import axios from 'axios';

// Placeholder key - user should replace this
const GEMINI_API_KEY = 'PLACEHOLDER_KEY'; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Solves a math problem from an image using Gemini API.
 * @param {string} base64Image - Base64 encoded image string (without data URI prefix).
 * @returns {Promise<string>} - The solution text.
 */
export const solveMathProblem = async (base64Image) => {
  try {
    // Ensure base64 string is clean (remove header if present)
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const payload = {
      contents: [
        {
          parts: [
            { text: "Solve this math problem. Please provide step-by-step solution and the final answer clearly." },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: cleanBase64
              }
            }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    throw new Error("No solution could be generated.");

  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    throw error;
  }
};
