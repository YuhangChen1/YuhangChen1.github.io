import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const galleryDirectory = path.resolve("out/japan");
const photos = (await readdir(galleryDirectory)).filter((file) => /\.jpg$/i.test(file));
let originalBytes = 0;
let optimizedBytes = 0;

// Resize only the exported copies; public/japan retains the original photographs.
for (const photo of photos) {
  const destination = path.join(galleryDirectory, photo);
  const original = await readFile(destination);
  const optimized = await sharp(original)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await writeFile(destination, optimized);
  originalBytes += original.length;
  optimizedBytes += optimized.length;
}

await writeFile("out/.nojekyll", "");
console.log(`Optimized ${photos.length} gallery photos: ${(originalBytes / 1024 / 1024).toFixed(1)} MB -> ${(optimizedBytes / 1024 / 1024).toFixed(1)} MB.`);
