 
import { For, type Component, Show, createSignal, createEffect, onMount, useContext } from 'solid-js';

import { GalleryEntryData, LightBoxContext } from '../components/Lightbox';

import styles from './Gallery.module.css';

// gallerydata.json gets saved here so we only have to fetch it once per session
let cachedGalleryData: GalleryEntryData[];

const Gallery: Component = () => {
  const [galleryEntries, setGalleryEntries] = createSignal<GalleryEntryData[]>([]);

  if (cachedGalleryData != null) {
    // load cached data
    setGalleryEntries(cachedGalleryData);
  } else {
    // fetch and cache gallery data
    fetch(`/gallerydata.json`).then(async (response) => {
      if (response.status !== 200) {
        return console.error(`couldn't fetch gallery data: ${response.status}`);
      }
  
      const data: GalleryEntryData[] = JSON.parse(await response.text());
  
      console.debug(data);
      cachedGalleryData = data;
      setGalleryEntries(data);
    });
  }

  // FIXME: what would be the correct type for this?
  const { LBData, setLBData }: any = useContext(LightBoxContext);

  return (
    <main class={styles.gallery}>
      <h2>stuff i made</h2>

      <div class={styles.entryList}>
        <Show when={galleryEntries().length > 0} fallback={<h3>loading...</h3>}>
          <For each={galleryEntries()}>
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
                <a class={styles.entry} href="javascript:void(0)" onClick={() => setLBData(entry)}>
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
  );
};

export default Gallery;