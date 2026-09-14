import sharp from 'sharp';
import path from 'path';

const wordmarkInputPath = process.env.INPUT_PATH || path.resolve('public/nexgen-wordmark.png');
const publicDir = path.resolve('public');

async function processWordmark() {
  const metadata = await sharp(wordmarkInputPath).metadata();
  console.log('Wordmark input metadata:', metadata);

  const { data, info } = await sharp(wordmarkInputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const maxChannel = Math.max(r, g, b);

    // Thresholds for solid black background removal
    const thresholdLow = 18;
    const thresholdHigh = 70;

    let alpha = 0;
    let outR = r;
    let outG = g;
    let outB = b;

    if (maxChannel <= thresholdLow) {
      alpha = 0;
      outR = 0;
      outG = 0;
      outB = 0;
    } else if (maxChannel < thresholdHigh) {
      const t = (maxChannel - thresholdLow) / (thresholdHigh - thresholdLow);
      alpha = Math.round(t * 255);
      const normAlpha = alpha / 255;
      outR = Math.min(255, Math.round(r / (normAlpha || 1)));
      outG = Math.min(255, Math.round(g / (normAlpha || 1)));
      outB = Math.min(255, Math.round(b / (normAlpha || 1)));
    } else {
      alpha = 255;
      outR = r;
      outG = g;
      outB = b;
    }

    const outIdx = (i / channels) * 4;
    outBuffer[outIdx] = outR;
    outBuffer[outIdx + 1] = outG;
    outBuffer[outIdx + 2] = outB;
    outBuffer[outIdx + 3] = alpha;
  }

  // Save the trimmed transparent wordmark
  await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
  .trim()
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(path.join(publicDir, 'nexgen-wordmark.png'));

  const trimmedMeta = await sharp(path.join(publicDir, 'nexgen-wordmark.png')).metadata();
  console.log('Trimmed wordmark metadata:', trimmedMeta);
}

processWordmark().catch(console.error);
