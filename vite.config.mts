import { basename, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://rollupjs.org/configuration-options/#input
type EntryTable = {
  [ entryName: string ]: string
}

function getAllHtmlFiles() {
  const entries: EntryTable = {};

  const rootDirFiles = readdirSync(`./`, { withFileTypes: true })
    .filter((item) => 
      item.isFile() 
      && item.name.toLowerCase().endsWith(`.html`)
    );

  for (const file of rootDirFiles) {
    entries[file.name] = resolve(`./`, file.name);
  }

  return entries;
}

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: getAllHtmlFiles()
    }
  }
});
