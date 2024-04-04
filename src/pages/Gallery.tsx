 
import { For, type Component, Show, createSignal, createEffect, onMount } from 'solid-js';

import styles from './Gallery.module.css';

// TODO: literally everything

// TODO: detailed descriptions for every gallery entry?

// TODO: make sure pressing back button to close lightbox works!!!

// TODO: lightbox controls: zoom in/out, pan, next/prev img, close

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
  //TODO: move all lightbox logic to its own component

  const [gallery, setGallery] = createSignal<GalleryEntryData[]>([]);
  const [LBItems, setLBItems] = createSignal<GalleryEntryImageData[]>([]);
  const [LBSelected, setLBSelected] = createSignal<GalleryEntryImageData>();
  const [canvasWidth, setCanvasWidth] = createSignal(document.documentElement.clientWidth);
  const [canvasHeight, setCanvasHeight] = createSignal(document.documentElement.clientHeight);
  const viewerImage = new Image();
  const viewerTransform = {
    default: {
      posX: 0,
      posY: 0,
      width: 0,
      height: 0
    },
    current: {
      posX: 0,
      posY: 0,
      width: 0,
      height: 0
    }
  }
  let lightbox!: HTMLDialogElement;
  let viewport!: HTMLCanvasElement;

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

  const redrawViewerImage = () => {
    if (viewerImage.src.length === 0) return;

    const ctx = viewport.getContext(`2d`);

    if (!(ctx instanceof CanvasRenderingContext2D)) {
      return console.error(`incorrect canvas context, something is broken!`, ctx);
    }

    ctx.clearRect(0, 0, viewport.width, viewport.height);

    // TODO: make this only run once for each new image
    const vdefault = viewerTransform.default;

    vdefault.width = Math.min(viewport.width, viewerImage.width);
    vdefault.height = Math.min(viewport.height, viewerImage.height);

    vdefault.width = Math.min(vdefault.width, viewerImage.width * (vdefault.height / viewerImage.height));
    vdefault.height = Math.min(vdefault.height, viewerImage.height * (vdefault.width / viewerImage.width));

    vdefault.posX = (viewport.width / 2) - (vdefault.width / 2);
    vdefault.posY = (viewport.height / 2) - (vdefault.height / 2);

    viewerTransform.current.posX = viewerTransform.default.posX;
    viewerTransform.current.posY = viewerTransform.default.posY;
    viewerTransform.current.width = viewerTransform.default.width;
    viewerTransform.current.height = viewerTransform.default.height;

    ctx.drawImage(
      viewerImage, 
      viewerTransform.current.posX, 
      viewerTransform.current.posY, 
      viewerTransform.current.width, 
      viewerTransform.current.height
    );
  }

  const loadViewerImage = (src: string) => {    
    viewerImage.src = src;
    viewerImage.onload = () => {
      redrawViewerImage();
    };
  };

  const openLightbox = (items: GalleryEntryImageData[]) => {
    console.debug(`lightbox opened`);
    setLBItems(items);
    setLBSelected(items[0]);
    lightbox.showModal();
  };

  const closeLightbox = () => {
    console.debug(`lightbox closed`);
    lightbox.close();
    setLBItems([]);
  };

  onMount(() => {
    window.addEventListener(`resize`, () => {
      setCanvasWidth(document.documentElement.clientWidth);
      setCanvasHeight(document.documentElement.clientHeight);
      redrawViewerImage();
    });
  });

  createEffect(() => {
    const selected = LBSelected();

    if (selected != null) loadViewerImage(LBSelected()!.filename);
  })

  return (
    <>
      <dialog class={styles.lightbox} ref={lightbox}>
        <div class={styles.lbTopBar}>
          <button autofocus onClick={() => { closeLightbox() }}>Close</button>
        </div>

        <canvas class={styles.viewport} width={canvasWidth()} height={canvasHeight()} ref={viewport}></canvas>

        <div class={styles.lbBotBar}>
          <div class={styles.carousel}>
            <For each={LBItems()}>
              {(image) => {
                return (
                  <button onClick={() => { setLBSelected(image) }}>
                    <img src={image.filename}></img>
                  </button>
                )
              }}
            </For>
          </div>
        </div>
      </dialog>

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
                  <a class={styles.entry} href="javascript:void(0)" onClick={() => { openLightbox(entry.images) }}>
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