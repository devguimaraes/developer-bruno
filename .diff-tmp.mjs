import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const dir = process.argv[2];
for (const a of fs.readdirSync(dir).filter(f => f.endsWith('-5001.png'))) {
  const b = a.replace('-5001', '-5002');
  const A = await sharp(path.join(dir, a)).raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(path.join(dir, b)).raw().toBuffer({ resolveWithObject: true });
  if (A.info.height !== B.info.height) { console.log(a.replace('-5001.png',''), 'ALTURA', A.info.height, '->', B.info.height); continue; }
  let n = 0, minY = 1e9, maxY = -1; const c = A.info.channels, w = A.info.width;
  for (let i = 0; i < A.data.length; i += c) { let d = 0; for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(A.data[i+k] - B.data[i+k])); if (d > 16) { n++; const y = Math.floor(i / c / w); minY = Math.min(minY, y); maxY = Math.max(maxY, y); } }
  console.log(a.replace('-5001.png',''), 'px:', n, n ? `linhas ${minY}-${maxY}` : '');
}
