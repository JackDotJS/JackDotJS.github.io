import type { Component } from 'solid-js';

import styles from './Footer.module.css';

// TODO: add logic to load build date and revision id

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <h2>i also made this website</h2>
      <div>
        made with 
        <a href="https://www.solidjs.com/" rel="external">SolidJS</a>, 
        <a href="https://vitejs.dev/" rel="external">Vite</a>, and 
        <a href="https://www.typescriptlang.org/" rel="external">TypeScript</a>.
      </div>
      <div class={styles.buildInfo}>
        <div>
          build date: <b><time id="gh-build" datetime="">[...]</time></b><br/>
        </div>
        <div>
          rev: <b><a id="gh-rev" href="">[...]</a></b>
        </div>
      </div>
      <div>
        <a href="https://github.com/JackDotJS/JackDotJS.github.io" rel="external" title="Source Code">source code</a> (MIT License)
      </div>
    </footer>
  );
};

export default Footer;
