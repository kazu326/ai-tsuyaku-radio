import "dotenv/config";
import fs from "node:fs/promises";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;

const text = await fs.readFile("./docs/elevenlabs.txt", "utf8");

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  text,
  model_id: "eleven_v3",
  language_code: "ja",
  voice_settings: {
    stability: 0.5,
  },
  apply_text_normalization: "auto",
}),
  }
);

if (!response.ok) {
  throw new Error(await response.text());
}

const audio = Buffer.from(await response.arrayBuffer());

await fs.writeFile("./public/narration.mp3", audio);

console.log("Audio generated.");