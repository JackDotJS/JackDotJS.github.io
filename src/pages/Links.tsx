 
import { For, type Component } from 'solid-js';

import styles from './Links.module.css';

const Links: Component = () => {
  const items = [
    {
      title: `bluesky`,
      url: `https://bsky.app/profile/jackdotjs.bsky.social`,
      style: styles.bluesky
    },
    {
      title: `github`,
      url: `https://github.com/JackDotJS`,
      style: styles.github
    },
    {
      title: `discord`,
      text: `@jackdotjs`,
      style: styles.discord
    },
    {
      title: `steam`,
      url: `https://steamcommunity.com/id/JackDotJS/`,
      style: styles.steam
    },
    {
      title: `youtube`,
      url: `https://www.youtube.com/@JackDotJS`,
      style: styles.youtube
    },
    {
      title: `ko-fi`,
      url: `https://ko-fi.com/jackdotjs`,
      style: styles.kofi
    },
  ]

  return (
    <main class={styles.linklist}>
      <h2>some places you can find me at</h2>

      <For each={items}>
        {(item) => {
          if (item.url) return (
            <label class={item.style}>
              <input type="checkbox" autocomplete="off" />
              <span>{item.title}</span>
              <div>
                <a href={item.url} rel="external">{item.url}</a>
              </div>
            </label>
          )

          return (
            <label class={item.style}>
              <input type="checkbox" autocomplete="off" />
              <span>{item.title}</span>
              <div>{item.text}</div>
            </label>
          )
        }}
      </For>

      <span>if it's not linked here, chances are it's not me. <em>you have been warned!</em></span>
    </main>
  );
};

export default Links;