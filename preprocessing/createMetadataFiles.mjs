import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { parseAndValidate } from './validateMetadata.mjs';

// get list of gallery item directories, ignoring files
const galleryItems = readdirSync(`./public/gallery`, { withFileTypes: true })
  .filter((item) => item.isDirectory());

//console.debug(inspect(galleryItems, { depth: null, colors: true }));

const newGalleryData = [];

for (const item of galleryItems) {
  // get metadata file
  const mFile = `${item.path}/${item.name}/meta.json`;

  console.debug(mFile);

  let metadata;

  try {
    metadata = JSON.parse(readFileSync(mFile, { encoding: `utf-8` }));
  }
  catch (err) {
    console.error(err);
    continue;
  }

  const parsed = parseAndValidate(metadata, mFile);

  newGalleryData.push(parsed);
}

// sort final array to ensure latest gallery items are first
newGalleryData.sort((a, b) => {
  const imgA = a.images[0];
  const imgB = b.images[0];

  const chkYear = imgB.year - imgA.year;
  const chkMonth = imgB.month - imgA.month;
  const chkIndex = (imgB.index ?? 0) - (imgA.index ?? 0)

  if (chkYear !== 0) return chkYear;
  if (chkMonth !== 0) return chkMonth;
  if (chkIndex !== 0) return chkIndex;
});

//console.debug(inspect(newGalleryData, { depth: null, colors: true }));

const outputDir = `./public/metadata`;

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

writeFileSync(`${outputDir}/gallery.json`, JSON.stringify(newGalleryData));

// create avatar metadata
try {
  const avatarsPath = `./public/assets/avatars/meta.json`;
  const avatarMetadata = JSON.parse(readFileSync(avatarsPath, { encoding: `utf-8` }));
  const parsedAvatars = parseAndValidate(avatarMetadata, avatarsPath);

  writeFileSync(`${outputDir}/avatar.json`, JSON.stringify(parsedAvatars));
}
catch (err) {
  console.error(err);
}

console.log(`done!`);
process.exit(0);