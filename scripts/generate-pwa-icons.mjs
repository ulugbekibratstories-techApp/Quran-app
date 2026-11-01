import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createGeometricIconPng(size, maskable = false) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const safeScale = maskable ? 0.72 : 0.86;
  const outerR = (size / 2) * safeScale;
  const innerR = outerR * 0.72;
  const ringThickness = Math.max(2, size * 0.028);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0;
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);

      const grad = Math.min(1, dist / (size * 0.72));
      let r = Math.round(6 * (1 - grad) + 4 * grad);
      let g = Math.round(78 * (1 - grad) + 42 * grad);
      let b = Math.round(59 * (1 - grad) + 32 * grad);
      let a = 255;

      if (!maskable) {
        const cornerR = size * 0.22;
        const qx = Math.max(0, Math.abs(dx) - (size / 2 - cornerR));
        const qy = Math.max(0, Math.abs(dy) - (size / 2 - cornerR));
        const cornerDist = Math.hypot(qx, qy);
        if (cornerDist > cornerR + 1) {
          a = 0;
        } else if (cornerDist > cornerR - 1) {
          a = Math.round(255 * ((cornerR + 1 - cornerDist) / 2));
        }
      }

      const sHalf = outerR * 0.56;
      const inSq1 = Math.abs(dx) <= sHalf && Math.abs(dy) <= sHalf;
      const edgeSq1 = inSq1 && (Math.abs(Math.abs(dx) - sHalf) <= ringThickness || Math.abs(Math.abs(dy) - sHalf) <= ringThickness);

      const rx = (dx - dy) * Math.SQRT1_2;
      const ry = (dx + dy) * Math.SQRT1_2;
      const inSq2 = Math.abs(rx) <= sHalf && Math.abs(ry) <= sHalf;
      const edgeSq2 = inSq2 && (Math.abs(Math.abs(rx) - sHalf) <= ringThickness || Math.abs(Math.abs(ry) - sHalf) <= ringThickness);

      const outerCircleEdge = Math.abs(dist - outerR * 0.92) <= ringThickness * 0.75;
      const centerMedallion = Math.abs(dist - innerR * 0.34) <= ringThickness * 0.85 || dist <= innerR * 0.12;

      if (edgeSq1 || edgeSq2 || outerCircleEdge || centerMedallion) {
        r = 212;
        g = 175;
        b = 55;
      } else if ((inSq1 && inSq2) && dist > innerR * 0.34) {
        r = 10;
        g = 92;
        b = 70;
      }

      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
      raw[px + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const pubDir = path.resolve('public');
fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), createGeometricIconPng(192, false));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), createGeometricIconPng(512, false));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), createGeometricIconPng(512, true));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createGeometricIconPng(180, true));

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#03281E"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C469"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#AA8220"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="196" stroke="url(#gold)" stroke-width="10" opacity="0.85"/>
  <rect x="136" y="136" width="240" height="240" rx="8" stroke="url(#gold)" stroke-width="14"/>
  <rect x="136" y="136" width="240" height="240" rx="8" transform="rotate(45 256 256)" stroke="url(#gold)" stroke-width="14"/>
  <circle cx="256" cy="256" r="56" stroke="url(#gold)" stroke-width="12"/>
  <circle cx="256" cy="256" r="18" fill="url(#gold)"/>
</svg>`;

fs.writeFileSync(path.join(pubDir, 'icon.svg'), svgIcon);
console.log('Generated all PWA icons in public/!');
