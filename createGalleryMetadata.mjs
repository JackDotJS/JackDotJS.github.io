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

  // ensure each entry is sorted by year
  metadata.images.sort((a, b) => a.year - b.year);

  newData.push(metadata);
}

// sort final array to ensure latest gallery items are first
newData.sort((a, b) => a.images[0].year - b.images[0].year);

//console.debug(inspect(newData, { depth: null, colors: true }));

writeFileSync(`./public/gallerydata.json`, JSON.stringify(newData));

console.log(`done!`);
process.exit(0);