import { inspect } from 'util';
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';

// get list of directories, ignoring files
const galleryItems = readdirSync(`./public/gallery`, { withFileTypes: true })
  .filter((item) => item.isDirectory());

//console.debug(inspect(galleryItems, { depth: null, colors: true }));

const newData = [];

for (const item of galleryItems) {
  // get metadata file
  const mFile = `${item.path}/${item.name}/meta.json`;

  let metadata;

  try {
    metadata = JSON.parse(readFileSync(mFile, { encoding: `utf-8` }));
  }
  catch (err) {
    console.error(err);
    continue;
  }

  //console.debug(inspect(metadata, { depth: null, colors: true }));

  // metadata typechecking
  try {
    if (typeof metadata.title !== `string`) {
      throw new TypeError(`(metadata.title) expected type "string", got "${typeof metadata.title}"`);
    }

    if (typeof metadata.description !== `string`) {
      throw new TypeError(`(metadata.description) expected type "string", got "${typeof metadata.description}"`);
    }

    if (typeof metadata.featured !== `string` && metadata.featured != null) {
      throw new TypeError(`(metadata.featured) expected type "string | null | undefined", got "${typeof metadata.featured}"`);
    }

    for (const i in metadata.images) {
      const entry = metadata.images[i];

      if (typeof entry.filename !== `string`) {
        throw new TypeError(`(metadata.images[${i}].filename) expected type "string", got "${typeof entry.filename}"`);
      }

      if (typeof entry.description !== `string` && entry.description != null) {
        throw new TypeError(`(metadata.images[${i}].description) expected type "string | null | undefined", got "${typeof entry.description}"`);
      }

      if (typeof entry.year !== `number`) {
        throw new TypeError(`(metadata.images[${i}].year) expected type "number", got "${typeof entry.year}"`);
      }

      if (typeof entry.month !== `number`) {
        throw new TypeError(`(metadata.images[${i}].month) expected type "number", got "${typeof entry.month}"`);
      }

      if (typeof entry.index !== `number` && entry.index != null) {
        throw new TypeError(`(metadata.images[${i}].index) expected type "number | null | undefined", got "${typeof entry.index}"`);
      }
    }
  }
  catch (err) {
    console.error(err);
    continue;
  }

  const imageFiles = readdirSync(`${item.path}/${item.name}`, { withFileTypes: true })
    .filter((item) => (item.isDirectory() || item.name !== `meta.json`));

  //console.debug(imageFiles);

  // check if featured image exists
  if (metadata.featured != null && !imageFiles.some((data) => data.name === metadata.featured)) {
    console.warn(`WARNING: could not find file "${metadata.featured}" in directory "${item.path}/${item.name}"!`);
  }

  // check for unused files
  checkUnused: for (const dirFile of imageFiles) {
    if (metadata.featured != null && metadata.featured === dirFile.name) continue checkUnused;
    
    for (const entry2 of metadata.images) {
      if (entry2.filename === dirFile.name) continue checkUnused;
    }

    // if we reach this point, then this file isn't listed in meta.json
    console.warn(`WARNING: possibly unused file "${dirFile.name}" in "${item.path}/${item.name}"!`)
  }

  for (const entry of metadata.images) {
    // check if file actually exists
    if (!imageFiles.some((data) => data.name === entry.filename)) {
      console.warn(`WARNING: could not find file "${entry.filename}" in directory "${item.path}/${item.name}"!`);
    }

    // fix filepath for each entry
    entry.filename = `/gallery/${item.name}/${entry.filename}`;
  }

  // fix filepath for featured image
  metadata.featured = `/gallery/${item.name}/${metadata.featured}`;

  // ensure each entry is sorted by year, month, and index
  metadata.images.sort((a, b) => {
    const chkYear = b.year - a.year;
    const chkMonth = b.month - a.month;
    const chkIndex = (b.index ?? 0) - (a.index ?? 0)

    if (chkYear !== 0) return chkYear;
    if (chkMonth !== 0) return chkMonth;
    if (chkIndex !== 0) return chkIndex;
  });

  newData.push(metadata);
}

// sort final array to ensure latest gallery items are first
newData.sort((a, b) => {
  const imgA = a.images[0];
  const imgB = b.images[0];

  const chkYear = imgB.year - imgA.year;
  const chkMonth = imgB.month - imgA.month;
  const chkIndex = (imgB.index ?? 0) - (imgA.index ?? 0)

  if (chkYear !== 0) return chkYear;
  if (chkMonth !== 0) return chkMonth;
  if (chkIndex !== 0) return chkIndex;
});

//console.debug(inspect(newData, { depth: null, colors: true }));

writeFileSync(`./public/gallerydata.json`, JSON.stringify(newData));

console.log(`done!`);
process.exit(0);