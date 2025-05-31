import { readdirSync } from 'fs';

export const parseAndValidate = (metadata, mdpath) => {
  const dir = mdpath.replace(/\/meta\.json$/gm, ``);
  // .replace(/^\.\/public|\/meta\.json$/gm);

  // metadata typechecking
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

  const imageFiles = readdirSync(dir, { withFileTypes: true })
    .filter((item) => (item.isDirectory() || item.name !== `meta.json`));

  //console.debug(imageFiles);

  // check if featured image exists
  if (metadata.featured != null && !imageFiles.some((data) => data.name === metadata.featured)) {
    console.warn(`WARNING: could not find file "${metadata.featured}" in directory "${dir}"!`);
  }

  // check for unused files
  checkUnused: for (const dirFile of imageFiles) {
    if (metadata.featured != null && metadata.featured === dirFile.name) continue checkUnused;
    
    for (const entry2 of metadata.images) {
      if (entry2.filename === dirFile.name) continue checkUnused;
    }

    // if we reach this point, then this file isn't listed in meta.json
    console.warn(`WARNING: possibly unused file "${dirFile.name}" in "${dir}"!`)
  }

  for (const entry of metadata.images) {
    // check if file actually exists
    if (!imageFiles.some((data) => data.name === entry.filename)) {
      console.warn(`WARNING: could not find file "${entry.filename}" in directory "${dir}"!`);
    }

    // fix filepath for each entry
    entry.filename = `${dir}/${entry.filename}`.replace(/^\.\/public/gm, ``);
  }

  // ensure each entry is sorted by year, month, and index
  metadata.images.sort((a, b) => {
    const chkYear = b.year - a.year;
    const chkMonth = b.month - a.month;
    const chkIndex = (b.index ?? 0) - (a.index ?? 0)

    if (chkYear !== 0) return chkYear;
    if (chkMonth !== 0) return chkMonth;
    if (chkIndex !== 0) return chkIndex;
    console.warn(`WARNING: found identical sorting numbers in "${dir}" between images "${a.filename}" and "${b.filename}"`);
    return 0;
  });

  // fix filepath for featured image, if its defined
  if (metadata.featured != null) {
    metadata.featured = `${dir}/${metadata.featured}`.replace(/^\.\/public/gm, ``);
  } else {
    metadata.featured = metadata.images[0].filename
  }

  return metadata;
}