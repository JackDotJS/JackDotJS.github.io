 
import { For, type Component, Show, createSignal, createEffect, onMount, useContext } from 'solid-js';

import { GalleryEntryData, LightBoxContext } from '../components/Lightbox';

import styles from './Gallery.module.css';

const fetchGallery = fetch(`/gallerydata.json`);

const Gallery: Component = () => {
  const [galleryEntries, setGalleryEntries] = createSignal<GalleryEntryData[]>([]);

  onMount(() => {
    fetchGallery.then(async (orgResponse) => {
      const response = orgResponse.clone();

      if (response.status !== 200) {
        return console.error(`couldn't fetch gallery data: ${response.status}`);
      }
    
      const data: GalleryEntryData[] = JSON.parse(await response.text());
    
      console.debug(data);
      setGalleryEntries(data);
    });
  });

  // FIXME: what would be the correct type for this?
  const { LBData, setLBData }: any = useContext(LightBoxContext);

  return (
    <main class={styles.gallery}>
      <h2>stuff i made</h2>

      <p><b>WARNING:</b> this part of the site is still under construction. a lot of things are missing or just aren't working yet. you have been warned!</p>

      <div class={styles.entryList}>
        <Show when={galleryEntries().length > 0} fallback={<h3>loading...</h3>}>
          <For each={galleryEntries()}>
            {(entry) => {
              let featureImage = entry.images[0].filename
              let yearLabel;
              const yearStart = entry.images[entry.images.length-1].year;
              const yearEnd = entry.images[0].year;

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