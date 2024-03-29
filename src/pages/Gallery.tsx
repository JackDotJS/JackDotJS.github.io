 
import { For, type Component, onMount, Show, createSignal } from 'solid-js';

import styles from './Gallery.module.css';

// TODO: literally everything

// TODO: detailed descriptions for every gallery entry?

// TODO: make sure pressing back button to close lightbox works!!!

// TODO: somehow find a way to load and create gallery items dynamically instead of having to hardcode everything like before, maybe use something in github pages?

// TODO: support zoom controls in lightbox

interface GalleryEntryImageData {
  filename: string,
  description?: string,
  year: number,
}

interface GalleryEntryData {
  title: string,
  description: string,
  images: GalleryEntryImageData[]
}

// gallerydata.json gets saved here so we only have to fetch it once per session
let cachedGalleryData: GalleryEntryData[];

const Gallery: Component = () => {
  const [gallery, setGallery] = createSignal<GalleryEntryData[]>([]);

  if (cachedGalleryData != null) {
    // load cached data
    setGallery(cachedGalleryData);
  } else {
    // fetch and cache gallery data
    fetch(`/gallerydata.json`).then(async (response) => {
      if (response.status !== 200) {
        return console.error(`couldn't fetch gallery data: ${response.status}`);
      }
  
      const data: GalleryEntryData[] = JSON.parse(await response.text());
  
      console.debug(data);
      cachedGalleryData = data;
      setGallery(data);
    });
  }

  return (
    <>
      <div class={styles.lightbox}>

      </div>

      <main class={styles.gallery}>
        <h2>stuff i made</h2>

        <div class={styles.entries}>
          <Show when={gallery().length > 0} fallback={<h3>loading...</h3>}>
            <For each={gallery()}>
              {(entry) => {
                const component = <img src={entry.images[0].filename} />
                return component;
              }}
            </For>
          </Show>
        </div>
      </main>
    </>
  );
};

export default Gallery;