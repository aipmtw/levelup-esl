const fs = require('fs');
const path = require('path');

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastasia';

if (!SPEECH_KEY) {
  console.error('Set AZURE_SPEECH_KEY env var');
  process.exit(1);
}

const content = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content.json'), 'utf-8'));
const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const VOICES = {
  female: 'en-US-JennyNeural',
  male: 'en-US-GuyNeural',
};

async function generateAudio(text, voice, outputFile) {
  if (fs.existsSync(outputFile)) {
    console.log(`  SKIP (exists): ${path.basename(outputFile)}`);
    return;
  }

  const voiceName = VOICES[voice];
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Adjust rate based on level
  const rate = outputFile.includes('a1') || outputFile.includes('a2') ? '-15%' : '0%';

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'>
    <voice name='${voiceName}'>
      <mstts:express-as style="friendly">
        <prosody rate="${rate}">${escaped}</prosody>
      </mstts:express-as>
    </voice>
  </speak>`;

  const url = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': SPEECH_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
    },
    body: ssml,
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`  ERROR: ${path.basename(outputFile)} - ${err}`);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputFile, buffer);
  console.log(`  OK: ${path.basename(outputFile)} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  let total = 0;
  for (const level of content.levels) {
    console.log(`\n[${level.cefr}] ${level.label}`);
    for (const topic of level.topics) {
      for (const voice of ['female', 'male']) {
        const filename = `${topic.id}-${voice}.mp3`;
        const filepath = path.join(audioDir, filename);
        await generateAudio(topic.text, voice, filepath);
        total++;
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }
  console.log(`\nDone. Processed ${total} audio files.`);
}

main().catch(console.error);
