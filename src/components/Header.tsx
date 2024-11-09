import { useLocation } from '@solidjs/router';
import { createSignal, type Component, onMount, useContext, createEffect } from 'solid-js';

import { GalleryEntryData, LightBoxContext } from './Lightbox';

import styles from './Header.module.css';

// TODO: improve mobile styling (better navbar layout, smaller avatar)
// maybe make this whole thing generally close to desktop layout

const fetchAvatars = fetch(`/metadata/avatar.json`);

const Header: Component = () => {
  const [avatarGallery, setAvatarGallery] = createSignal<GalleryEntryData>();
  const [time, setTime] = createSignal(`0:00 PM`);

  let navContainer!: HTMLElement;

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

  createEffect(() => {
    const location = useLocation();
    // console.debug(`new location: ${location.pathname}`);

    const navLinks = navContainer.querySelectorAll(`a`);

    for (const a of navLinks) {
      if (!(a instanceof HTMLAnchorElement)) continue;

      const href = a.getAttribute(`href`);
      if (href == null) continue;

      a.className = ``;

      if (href == `/`) {
        if (location.pathname == href) {
          a.classList.add(styles.currentPage);
        }
      } else if (location.pathname.startsWith(href)) {
        a.classList.add(styles.currentPage);
      }
    }
  });

  return (
    <header class={styles.header}>
      <div class={styles.whoami}>
        <a class={styles.avatar} href="javascript:void(0)" onClick={() => setLBData(avatarGallery)}>
          <img src="/assets/avatars/icon.png" alt="Avatar" />
        </a>
        <div class={styles.summary}>
          <h1>i'm jack. i make stuff.</h1>
          <p>
            3d artist, designer, programmer, writer. <b>(he/him)</b><br/>
            <br/>
            it's about <b>{time()}</b> my time.
          </p>
        </div>
      </div>
      <nav class={styles.navigation} ref={navContainer}>
        <a href="/">home</a>
        <a href="/gallery">stuff i made</a>
        <a href="/specs">things i use</a>
        <a href="/tools">cool tools</a>
        <a href="/commissions">commissions</a>
        <a href="/links">social links</a>
      </nav>
    </header>
  );
};

export default Header;
