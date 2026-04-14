module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!speechKey) return res.status(500).json({ error: 'Speech service not configured' });

  const voiceName = voice === 'male'
    ? 'zh-TW-YunJheNeural'
    : 'zh-TW-HsiaoChenNeural';

  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='zh-TW'>
    <voice name='${voiceName}'>
      <mstts:express-as style="chat">
        <prosody rate="0%">${escapedText}</prosody>
      </mstts:express-as>
    </voice>
  </speak>`;

  try {
    const response = await fetch(
      `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': speechKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
        },
        body: ssml,
      }
    );
    if (!response.ok) {
      const err = await response.text();
      console.error('TTS error:', err);
      return res.status(502).json({ error: 'TTS service error' });
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'TTS error' });
  }
};
