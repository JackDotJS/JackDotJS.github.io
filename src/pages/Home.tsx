 
import { For, type Component, onMount, createSignal, useContext } from 'solid-js';

import { GalleryEntryData, LightBoxContext } from '../components/Lightbox';

import styles from './Home.module.css';

const fetchAvatars = fetch(`/metadata/avatar.json`);

const Home: Component = () => {
  const [avatarGallery, setAvatarGallery] = createSignal<GalleryEntryData>();
  const [time, setTime] = createSignal(`0:00 PM`);

  const socialLinks = [
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

  const updateMyTime = () => {
    setTime(new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: `America/Los_Angeles`
    }));
  }

  // FIXME: need a type for this
  const { setLBData }: any = useContext(LightBoxContext);

  onMount(() => {
      updateMyTime();
      setInterval(updateMyTime, 1000);
  
      fetchAvatars.then(async (orgResponse) => {
        const response = orgResponse.clone();
  
        if (response.status !== 200) {
          return console.error(`couldn't fetch avatar gallery data: ${response.status}`);
        }
      
        const data: GalleryEntryData = JSON.parse(await response.text());
      
        console.debug(data);
        setAvatarGallery(data);
      });
    });

  return (
    <main>
      <div class={styles.whoami}>
        <a class={styles.avatar} href="javascript:void(0)" onClick={() => setLBData(avatarGallery)}>
          <img src="/assets/avatars/icon.png" alt="Avatar" />
        </a>
        <div class={styles.summary}>
          <h1>i'm jackie. i make stuff.</h1>
          <p>
            3d artist, designer, programmer, writer. <em>(she/her)</em><br/>
            <br/>
            it's about <em>{time()}</em> my time.
          </p>
        </div>
      </div>

      <h2>some places you can find me at</h2>

      <div class={styles.linklist}>
        <For each={socialLinks}>
          {(item) => {
            if (item.url) {
              let anchor!: HTMLAnchorElement;

              let toggleTabNav = (e: Event) => {
                if (!(e.target instanceof HTMLInputElement)) return;

                if (e.target.checked) {
                  anchor.removeAttribute(`tabindex`);
                } else {
                  anchor.setAttribute(`tabindex`, `-1`);
                }
              }

              return (
                <label class={item.style}>
                  <input onchange={toggleTabNav} type="checkbox" autocomplete="off" />
                  <span>{item.title}</span>
                  <div>
                    <a ref={anchor} tabindex="-1" href={item.url} rel="external">{item.url}</a>
                  </div>
                </label>
              )
            }

            return (
              <label class={item.style}>
                <input type="checkbox" autocomplete="off" />
                <span>{item.title}</span>
                <div>{item.text}</div>
              </label>
            )
          }}
        </For>
      </div>

      <span>if it's not linked here, chances are it's not me. <em>you have been warned!</em></span>
    </main>
  );
};

export default Home;