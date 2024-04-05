import { createSignal, type Component, onMount } from 'solid-js';

import styles from './Footer.module.css';

const Footer: Component = () => {
  let buildDateElem!: HTMLTimeElement;
  let revHashElem!: HTMLAnchorElement;

  onMount(() => {
    fetch(`/gha-build.txt`).then(async (response) => {
      if (response.status !== 200) {
        return console.error(`couldn't fetch build date: ${response.status}`);
      }

      const text = await response.text();
      const num = parseInt(text);

      if (isNaN(num)) {
        return console.error(`gha-build: ${num}`);
      }

      const ghbuild = new Date(num * 1000);

      buildDateElem.textContent = ghbuild.toUTCString().toLocaleLowerCase(); // because uppercase letters are scary
      buildDateElem.setAttribute(`datetime`, ghbuild.toISOString());
    });

    fetch(`/gha-hash.txt`).then(async (response) => {
      if (response.status !== 200) {
        return console.error(`couldn't fetch revision hash: ${response.status}`);
      }

      const text = await response.text();
      const ghrev = text.trim();

      revHashElem.textContent = ghrev;
      revHashElem.setAttribute(`href`, `https://github.com/JackDotJS/JackDotJS.github.io/commit/${ghrev}`);
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
          build date: <b><time ref={buildDateElem} datetime="">[...]</time></b><br/>
        </div>
        <div>
          rev: <b><a ref={revHashElem} href="">[...]</a></b>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
