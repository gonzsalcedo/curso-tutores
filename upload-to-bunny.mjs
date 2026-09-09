import fs from 'fs';

const BUNNY_API_KEY = '8efbbf40-4c77-4749-862ce33aa610-c1a2-4a8c';
const LIBRARY_ID = '623568';
const VIDEO_PATH = '/Users/gonzalosalcedo/Desktop/Curso Tutores/landing tutores nuevo.mp4';

async function upload() {
  if (!fs.existsSync(VIDEO_PATH)) {
    throw new Error(`Video file not found at ${VIDEO_PATH}`);
  }

  const stats = fs.statSync(VIDEO_PATH);
  console.log(`1. Video file found: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

  console.log('2. Creating video in Bunny.net Stream library...');
  const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: {
      AccessKey: BUNNY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Video Landing Curso Tutores',
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Failed to create video object: ${createRes.status} ${text}`);
  }

  const createData = await createRes.json();
  const videoId = createData.guid;
  console.log(`Video created in Bunny.net with GUID: ${videoId}`);

  console.log('3. Uploading video data...');
  const fileBuffer = fs.readFileSync(VIDEO_PATH);

  const uploadRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
    method: 'PUT',
    headers: {
      AccessKey: BUNNY_API_KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: fileBuffer,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Failed to upload video content: ${uploadRes.status} ${text}`);
  }

  console.log('4. Upload complete!');
  const embedUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;
  console.log(`Embed URL: ${embedUrl}`);

  console.log('5. Waiting for initial encode confirmation...');
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 4000));
    try {
      const statusRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
        headers: { AccessKey: BUNNY_API_KEY },
      });
      if (statusRes.ok) {
        const data = await statusRes.json();
        console.log(`Status: ${data.status} | Encode Progress: ${data.encodeProgress}%`);
        if (data.encodeProgress > 0 || data.status === 4) {
          console.log('Video ready / encoding progressing!');
          break;
        }
      }
    } catch (e) {
      console.error('Check status error:', e.message);
    }
  }

  return { videoId, embedUrl };
}

upload().catch((err) => {
  console.error('Error during upload:', err);
  process.exit(1);
});
