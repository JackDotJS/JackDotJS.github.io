 
import type { Component } from 'solid-js';

import styles from './Links.module.css';

const Links: Component = () => {
  return (
    <main class={styles.linklist}>
      <h2>some places you can find me at</h2>
      <a class={styles.discord} rel="external" href="https://discord.gg/s5nQBxFPp2" title="Discord">
        <div aria-hidden="true"></div>
        <span>discord</span>
      </a>

      <a class={styles.revolt} rel="external" href="https://rvlt.gg/4KNknK8A" title="Revolt">
        <div aria-hidden="true"></div>
        <span>revolt</span>
      </a>

      <a class={styles.cohost} rel="external" href="https://cohost.org/JackDotJS" title="Cohost">
        <div aria-hidden="true"></div>
        <span>cohost</span>
      </a>

      <a class={styles.github} rel="external" href="https://github.com/JackDotJS" title="GitHub">
        <div aria-hidden="true"></div>
        <span>git&shy;hub</span>
      </a>

      <a class={styles.steam} rel="external" href="https://steamcommunity.com/id/JackDotJS/" title="Steam">
        <div aria-hidden="true"></div>
        <span>steam</span>
      </a>

      <a class={styles.youtube} rel="external" href="https://www.youtube.com/channel/UCiY8MRmlDVjVva6N-2zy36A" title="YouTube">
        <div aria-hidden="true"></div>
        <span>youtube</span>
      </a>

      <a class={styles.kofi} rel="external" href="https://ko-fi.com/jackdotjs" title="Ko-fi">
        <div aria-hidden="true"></div>
        <span>ko-fi</span>
      </a>

      <a class={styles.email} rel="external" href="mailto:JackDotBusiness@proton.me" title="E-mail">
        <div aria-hidden="true"></div>
        <span>e-mail</span>
      </a>

      <p>if it's not linked here, it's probably not me. you have been warned!</p>
    </main>
  );
};

export default Links;