 
import type { Component } from 'solid-js';

import styles from './Links.module.css';


// FIXME: missing all styling rules

// TODO: maybe use a single column this time, so
// we dont have to constantly worry about having
// an even number of links

const Links: Component = () => {
  return (
    <main>
      <h2>some places you can find me at</h2>
      <div class="button-list">
        <a id="li-discord" rel="external" href="https://discord.gg/s5nQBxFPp2" title="Discord">
          <div class="icon" aria-hidden="true"></div>
          <span>discord</span>
        </a>

        <a id="li-revolt" rel="external" href="https://rvlt.gg/4KNknK8A" title="Revolt">
          <div class="icon" aria-hidden="true"></div>
          <span>revolt</span>
        </a>

        <a id="li-fediverse" rel="external" href="https://feathered.cc/@jack" title="Mastodon">
          <div class="icon" aria-hidden="true"></div>
          <span>masto&shy;don</span>
        </a>

        <a id="li-github" rel="external" href="https://github.com/JackDotJS" title="GitHub">
          <div class="icon" aria-hidden="true"></div>
          <span>git&shy;hub</span>
        </a>

        <a id="li-kofi" rel="external" href="https://ko-fi.com/jackdotjs" title="Ko-fi">
          <div class="icon" aria-hidden="true"></div>
          <span>ko-fi</span>
        </a>

        <a id="li-retrospring" rel="external" href="https://retrospring.net/@JackDotJS" title="Retrospring">
          <div class="icon" aria-hidden="true"></div>
          <span>retro&shy;spring</span>
        </a>

        <a id="li-cohost" rel="external" href="https://cohost.org/JackDotJS" title="Cohost">
          <div class="icon" aria-hidden="true"></div>
          <span>cohost</span>
        </a>

        <a id="li-steam" rel="external" href="https://steamcommunity.com/id/JackDotJS/" title="Steam">
          <div class="icon" aria-hidden="true"></div>
          <span>steam</span>
        </a>

        <a id="li-youtube" rel="external" href="https://www.youtube.com/channel/UCiY8MRmlDVjVva6N-2zy36A" title="YouTube">
          <div class="icon" aria-hidden="true"></div>
          <span>youtube</span>
        </a>

        <a id="li-email" rel="external" href="mailto:JackDotBusiness@proton.me" title="E-mail">
          <div class="icon" aria-hidden="true"></div>
          <span>e-mail</span>
        </a>
      </div>

      <p>if it's not linked here, it's probably not me. you have been warned!</p>
    </main>
  );
};

export default Links;