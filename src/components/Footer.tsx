import type { Component } from 'solid-js';

import styles from './Footer.module.css';

// TODO: add logic to load build date and revision id

const Footer: Component = () => {
  return (
    <footer>
      <h2>i also made this website</h2>
      <p>
        made with 
        <a href="https://www.solidjs.com/" rel="external">SolidJS</a>, 
        <a href="https://vitejs.dev/" rel="external">Vite</a>, and 
        <a href="https://www.typescriptlang.org/" rel="external">TypeScript</a>.<br/>
        <br/>
        build date: <b><time id="gh-build" datetime="">[...]</time></b><br/>
        <br/>
        rev: <b><a id="gh-rev" href="">[...]</a></b>
      </p>
      <div class="button-list">
        <a href="https://github.com/JackDotJS/JackDotJS.github.io" rel="external" title="Source Code">
          <span>source code</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
