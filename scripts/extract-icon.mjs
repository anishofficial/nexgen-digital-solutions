import sharp from 'sharp';
import path from 'path';

const publicDir = path.resolve('public');
const fullLogoPath = path.join(publicDir, 'logo.png');

async function extractIcon() {
  const meta = await sharp(fullLogoPath).metadata();
  console.log('Full logo size:', meta.width, meta.height);

  // In a 750x437 image where ribbon icon is on top and NEXGEN text is on bottom:
  // Let's inspect the bounding area of the top icon.
  // The icon is roughly the top 65-70% of the image.
  // Let's create an icon by cropping the top portion, trimming it cleanly.
  const iconCropped = await sharp(fullLogoPath)
    .extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: Math.round(meta.height * 0.72)
    })
    .trim()
    .toBuffer();

  await sharp(iconCropped)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon.png'));

  const iconMeta = await sharp(path.join(publicDir, 'logo-icon.png')).metadata();
  console.log('Icon size:', iconMeta.width, iconMeta.height);

  // Also create a 64x64 and 32x32 favicon
  await sharp(iconCropped)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('Favicon created successfully!');
}

extractIcon().catch(console.error);
