 
import type { Component } from 'solid-js';

import styles from './Links.module.css';

const Links: Component = () => {
  return (
    <main class={styles.linklist}>
      <h2>some places you can find me at</h2>
      <a class={styles.discord} rel="external" href="https://discord.gg/s5nQBxFPp2" title="Discord">
        <span>discord</span>
        <div aria-hidden="true"></div>
      </a>

      <a class={styles.revolt} rel="external" href="https://rvlt.gg/4KNknK8A" title="Revolt">
        <span>revolt</span>
        <div aria-hidden="true"></div>
      </a>

      <a class={styles.github} rel="external" href="https://github.com/JackDotJS" title="GitHub">
        <span>git&shy;hub</span>
        <div aria-hidden="true"></div>
      </a>

      <a class={styles.steam} rel="external" href="https://steamcommunity.com/id/JackDotJS/" title="Steam">
        <span>steam</span>
        <div aria-hidden="true"></div>
      </a>

      <a class={styles.youtube} rel="external" href="https://www.youtube.com/channel/UCiY8MRmlDVjVva6N-2zy36A" title="YouTube">
        <span>youtube</span>
        <div aria-hidden="true"></div>
      </a>

      <a class={styles.kofi} rel="external" href="https://ko-fi.com/jackdotjs" title="Ko-fi">
        <span>ko-fi</span>
        <div aria-hidden="true"></div>
      </a>

      <a class={styles.email} rel="external" href="mailto:JackDotBusiness@proton.me" title="E-mail">
        <span>e-mail</span>
        <div aria-hidden="true"></div>
      </a>

      <span>if it's not linked here, chances are it's not me. <em>you have been warned!</em></span>
    </main>
  );
};

export default Links;