import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate image data
  // Scanlines: width * 4 + 1 filter byte per row
  const rowStride = width * 4 + 1;
  const rawData = Buffer.alloc(rowStride * height);

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 512;
  const radius = (width / 2) * (isMaskable ? 0.72 : 0.88);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter type None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep luxury slate/navy #020617
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      // Draw rounded emblem container in the center
      if (dist < radius) {
        // Subtle emerald-to-gold luxury gradient
        const t = (y / height);
        r = Math.floor(15 + t * 200); // 15 -> 215 (gold)
        g = Math.floor(80 + t * 100); // 80 -> 180
        b = Math.floor(50 - t * 30);  // 50 -> 20
        a = 255;

        // Inner circle dark core
        if (dist < radius * 0.94) {
          r = 10;
          g = 15;
          b = 30;

          // Stylized skyscraper towers inside the icon
          const nx = (x - cx) / scale; // normalized -256 to 256
          const ny = (y - cy) / scale;

          // Tower 1 (Left - shorter)
          if (nx >= -90 && nx <= -35 && ny >= -40 && ny <= 90) {
            r = 245; g = 158; b = 11; // Amber-500
          }
          // Tower 2 (Center - tallest Burj style spire)
          else if (nx >= -25 && nx <= 25 && ny >= -130 && ny <= 90) {
            r = 251; g = 191; b = 36; // Amber-400
            // Spire top
            if (ny < -80 && Math.abs(nx) > 8) {
              r = 10; g = 15; b = 30; // cut out sides of spire
            }
          }
          // Tower 3 (Right - medium)
          else if (nx >= 35 && nx <= 90 && ny >= -70 && ny <= 90) {
            r = 16; g = 185; b = 129; // Emerald-500
          }
          // Horizontal base line
          else if (nx >= -110 && nx <= 110 && ny >= 92 && ny <= 104) {
            r = 251; g = 191; b = 36; // Gold accent
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

// Also generate public/icon.svg for browser tab and modern SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)"/>
  <circle cx="256" cy="256" r="215" fill="none" stroke="url(#goldGrad)" stroke-width="8" opacity="0.8"/>
  <rect x="160" y="210" width="55" height="150" rx="6" fill="#d97706"/>
  <rect x="228" y="140" width="56" height="220" rx="8" fill="url(#goldGrad)"/>
  <polygon points="256,90 248,140 264,140" fill="#fde68a"/>
  <rect x="296" y="180" width="55" height="180" rx="6" fill="url(#emeraldGrad)"/>
  <rect x="135" y="365" width="242" height="14" rx="4" fill="url(#goldGrad)"/>
  <circle cx="256" cy="80" r="6" fill="#fef08a"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('Successfully generated all PWA icons in /public!');
