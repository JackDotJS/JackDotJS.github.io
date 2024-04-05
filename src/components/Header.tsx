import { createSignal, type Component, onMount, useContext } from 'solid-js';

import { GalleryEntryData, LightBoxContext } from './Lightbox';

import styles from './Header.module.css';

const Header: Component = () => {
  const [time, setTime] = createSignal(`0:00 PM`);

  const updateMyTime = () => {
    setTime(new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: `America/Los_Angeles`
    }));
  }

  onMount(() => {
    updateMyTime();
    setInterval(updateMyTime, 1000);
  });

  // FIXME: what would be the correct type for this?
  const { LBData, setLBData }: any = useContext(LightBoxContext);

  // TODO: might be cool to have all my old avatars here? a lil easter egg sorta
  // but if i do go through with that, this should probably go in its own file like the gallerydata
  const avatarImageMetaData: GalleryEntryData = {
    title: `Avatar`,
    description: ``, 
    images: [{
      filename: `/assets/icon.png`,
      year: 2022.3
    }]
  }

  return (
    <header class={styles.header}>
      <div class={styles.whoami}>
        <a class={styles.avatar} href="javascript:void(0)" onClick={() => setLBData(avatarImageMetaData)}>
          <img src="/assets/icon.png" alt="Icon of an orange bird head, with a tired expression on his face." />
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
      <nav class={styles.navigation}>
        <a href="/">home</a>
        <a href="/gallery">stuff i made</a>
        <a href="/specs">things i use</a>
        <a href="/commissions">commission info</a>
        <a href="/links">social links</a>
      </nav>
    </header>
  );
};

export default Header;
