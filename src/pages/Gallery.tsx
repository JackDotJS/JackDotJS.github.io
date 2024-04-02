 
import { For, type Component, onMount, Show, createSignal } from 'solid-js';

import styles from './Gallery.module.css';

// TODO: literally everything

// TODO: detailed descriptions for every gallery entry?

// TODO: make sure pressing back button to close lightbox works!!!

// TODO: support zoom controls in lightbox

interface GalleryEntryImageData {
  filename: string,
  description?: string,
  year: number,
}

interface GalleryEntryData {
  title: string,
  description: string,
  featured?: string,
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

        <div class={styles.entryList}>
          <Show when={gallery().length > 0} fallback={<h3>loading...</h3>}>
            <For each={gallery()}>
              {(entry) => {
                let featureImage = entry.images[0].filename
                let yearLabel;
                const yearStart = Math.floor(entry.images[entry.images.length-1].year);
                const yearEnd = Math.floor(entry.images[0].year);

                // use featured image if available
                if (entry.featured != null) {
                  featureImage = entry.featured;
                }

                // show year range if applicable, otherwise use year value from first image entry
                if (yearStart === yearEnd) {
                  yearLabel = (
                    <span><time datetime={yearEnd.toString()}>{yearEnd.toString()}</time></span>
                  )
                } else {
                  yearLabel = (
                    <span>
                      <time datetime={yearStart.toString()}>{yearStart.toString()}</time>
                      -
                      <time datetime={yearEnd.toString()}>{yearEnd.toString()}</time>
                    </span>
                  )
                }

                return (
                  <a class={styles.entry} href="javascript:void(0)" onClick={() => { /** TODO: open gallery lightbox */}}>
                    <img src={featureImage} />
                    <h3>{entry.title}</h3>
                    {yearLabel}
                  </a>
                )
              }}
            </For>
          </Show>
        </div>
      </main>
    </>
  );
};

export default Gallery;