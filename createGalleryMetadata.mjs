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

  // fix filepath for each entry
  for (const entry of metadata.images) {
    entry.filename = `/gallery/${item.name}/${entry.filename}`;
  }

  // ensure each entry is sorted by year
  metadata.images.sort((a, b) => a.year - b.year);

  newData.push(metadata);
}

// sort final array to ensure latest gallery items are first
newData.sort((a, b) => a.images[0].year - b.images[0].year);

console.debug(inspect(newData, { depth: null, colors: true }));

writeFileSync(`./public/gallerydata.json`, JSON.stringify(newData));

console.log(`done!`);
process.exit(0);