import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import mdDefaults from './pageMetadataDefaults.json' with { type: 'json' };

const htmltemplate = readFileSync(`${import.meta.dirname}/template.html`, { encoding: `utf-8` });
const pagesMasterDir = `./src/pages`;

// cleanup any existing html files
const rootDirFiles = readdirSync(`./`, { withFileTypes: true })
  .filter((item) => item.isFile());

for (const file of rootDirFiles) {
  if (file.name.toLowerCase().endsWith(`.html`)) {
    const target = `./${file.name}`;
    unlinkSync(`./${file.name}`);
    console.log(`deleted: ${target}`);
  }
}

const pageDirItems = readdirSync(pagesMasterDir, { withFileTypes: true })
  .filter((item) => item.isDirectory());

for (const pageDir of pageDirItems) {
  // get metadata file
  const mFile = `${pageDir.path}/${pageDir.name}/pageMetadata.json`;
  let metadata;

  try {
    // read and parse metadata file as json
    metadata = JSON.parse(readFileSync(mFile, { encoding: `utf-8` }));
  }
  catch (err) {
    console.error(err);
    continue;
  }

  // overwrite default values with custom values as needed
  const finalData = {...mdDefaults, ...metadata};
  finalData.TITLE = `${finalData.TITLE} - jackiedotjs`;
  finalData.OGTITLE = finalData.TITLE;
  // console.debug(finalData);

  let fileContent = htmltemplate;
  for (const key of Object.keys(finalData)) {
    // console.debug(key);

    // replace template strings with custom strings
    fileContent = fileContent.replaceAll(new RegExp(`%%${key}%%`, `gm`), finalData[key]);
  }

  // console.debug(fileContent);

  // done!
  writeFileSync(`./${pageDir.name}.html`, fileContent);
}