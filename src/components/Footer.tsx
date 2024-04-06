import { createSignal, type Component, onMount } from 'solid-js';

import styles from './Footer.module.css';

const fetchBuild = fetch(`/gha-build.txt`)
const fetchHash = fetch(`/gha-hash.txt`)

interface UnitList {
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  [key: string]: number
}

const Footer: Component = () => {
  const [buildDate, setBuildDate] = createSignal(`[...]`);
  const [buildDateRelative, setBuildDateRelative] = createSignal(`[...]`);
  const [buildDateISO, setBuildDateISO] = createSignal(``);
  const [revHash, setRevHash] = createSignal(`[...]`);

  onMount(() => {
    fetchBuild.then(async (response) => {
      if (response.status !== 200) {
        return console.error(`couldn't fetch build date: ${response.status}`);
      }
    
      const text = await response.text();
      const num = parseInt(text);
    
      if (isNaN(num)) {
        return console.error(`gha-build: ${num}`);
      }
    
      const ghbuild = new Date(num * 1000);
    
      // uppercase letters are scary
      setBuildDate(ghbuild.toUTCString().toLocaleLowerCase());
      setBuildDateISO(ghbuild.toISOString());

      const units: UnitList = {
        year: 1000 * 60 * 60 * 24 * 365,
        month: (1000 * 60 * 60 * 24 * 365) / 12,
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60,
        second: 1000
      }

      const rtf = new Intl.RelativeTimeFormat(`en`, { numeric: `auto` });

      const updateRelativeDate = () => {
        const now = new Date();

        const elapsed = ghbuild.getTime() - now.getTime();

        let selectedUnit = `second`;

        for (const unit in units) {
          if (Math.abs(elapsed) > units[unit]) {
            selectedUnit = unit;
            break;
          }
        }

        const formatted = rtf.format(
          Math.round(elapsed/units[selectedUnit]), 
          selectedUnit as Intl.RelativeTimeFormatUnit
        );

        setBuildDateRelative(formatted);
      }

      updateRelativeDate();

      setInterval(() => {
        updateRelativeDate();
      }, 1000);
    });

    fetchHash.then(async (response) => {
      if (response.status !== 200) {
        return console.error(`couldn't fetch revision hash: ${response.status}`);
      }
    
      const text = await response.text();
    
      setRevHash(text.trim());
    });
  });

  return (
    <footer class={styles.footer}>
      <h2>i also made this website</h2>
      <div>
        <a href="https://github.com/JackDotJS/JackDotJS.github.io" rel="external" title="Source Code">it's fully open-source</a>. (MIT License)
      </div>
      <div>
        made with 
        <a href="https://www.solidjs.com/" rel="external">SolidJS</a>, 
        <a href="https://vitejs.dev/" rel="external">Vite</a>, and 
        <a href="https://www.typescriptlang.org/" rel="external">TypeScript</a>.
      </div>
      <div class={styles.buildInfo}>
        <div>
          build date: <b><time datetime={buildDateISO()}>{buildDate()}</time></b> ({buildDateRelative()})<br/>
        </div>
        <div>
          rev: <b><a href={`https://github.com/JackDotJS/JackDotJS.github.io/commit/${revHash()}`}>{revHash()}</a></b>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
