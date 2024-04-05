import { For, type Component, createSignal, createEffect, onMount, createContext, JSXElement, Show } from 'solid-js';

import styles from './Lightbox.module.css';

// TODO: detailed descriptions for every gallery entry?

// TODO: make sure pressing back button to close lightbox works!!!

// TODO: lightbox controls: zoom in/out, pan, next/prev img, fullscreen, view original, close

export interface GalleryEntryImageData {
  filename: string,
  description?: string,
  year: number,
}

export interface GalleryEntryData {
  title: string,
  description: string,
  featured?: string,
  images: GalleryEntryImageData[]
}

export const LightBoxContext = createContext();

export const Lightbox: Component<{ children: string | JSXElement }> = (props) => {
  const [LBData, setLBData] = createSignal<GalleryEntryData|null>(null);
  const [selectedImage, setSelectedImage] = createSignal<number>(0);
  const [canvasWidth, setCanvasWidth] = createSignal(document.documentElement.clientWidth);
  const [canvasHeight, setCanvasHeight] = createSignal(document.documentElement.clientHeight);
  const [uiVisible, setUiVisible] = createSignal<boolean>(true);
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

  // TIL timeouts are just plain numbers... for some reason...
  let uiFadeTimeout: number;

  const restartUIFade = () => {
    window.clearTimeout(uiFadeTimeout);

    setUiVisible(true);
    uiFadeTimeout = setTimeout(() => {
      setUiVisible(false);
    }, 2000);
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

  const gotoPrev = () => {
    const gdata = LBData();
    if (gdata == null) return;

    const target = selectedImage() - 1;

    if (target < 0) {
      setSelectedImage(gdata.images.length - 1);
    } else {
      setSelectedImage(target);
    }
  }

  const gotoNext = () => {
    const gdata = LBData();
    if (gdata == null) return;

    const target = selectedImage() + 1;

    if (target > (gdata.images.length - 1)) {
      setSelectedImage(0);
    } else {
      setSelectedImage(target);
    }
  }

  onMount(() => {
    window.addEventListener(`resize`, () => {
      setCanvasWidth(document.documentElement.clientWidth);
      setCanvasHeight(document.documentElement.clientHeight);
      redrawViewerImage();
    });

    window.addEventListener(`pointermove`, () => {
      restartUIFade();
    });

    window.addEventListener(`keydown`, () => {
      restartUIFade();
    });

    window.addEventListener(`pointerdown`, () => {
      restartUIFade();
    });
  });

  createEffect(() => {
    const gdata = LBData();

    if (gdata === null) return;

    loadViewerImage(LBData()!.images[selectedImage()].filename);
  });

  createEffect(() => {
    const gdata = LBData();

    if (gdata !== null && !lightbox.open) {
      console.debug(`lightbox opened`);
      document.documentElement.style.overflow = `hidden`;
      document.body.style.overflow = `hidden`;
      setSelectedImage(0);
      restartUIFade();
      lightbox.showModal();
    }
    
    if (gdata === null && lightbox.open) {
      // TODO: clear canvas data on close
      console.debug(`lightbox closed`);
      document.documentElement.style.overflow = ``;
      document.body.style.overflow = ``;
      lightbox.close();
    }
  });

  return (
    <LightBoxContext.Provider value={{LBData, setLBData}}>
      <dialog class={ uiVisible() ? styles.lightbox : styles.lightboxNoUi } ref={lightbox}>
        <div class={styles.lbTopBar}>
          <button autofocus onClick={() => { setLBData(null) }}>Close</button>
        </div>

        <Show when={ LBData() !== null && LBData()!.images.length > 1 }>
          <button class={styles.prevButton} onClick={() => gotoPrev()}>previous</button>
          <button class={styles.nextButton} onClick={() => gotoNext()}>next</button>
        </Show>

        <canvas class={styles.viewport} width={canvasWidth()} height={canvasHeight()} ref={viewport}></canvas>

        <div class={styles.lbBotBar}>
          <Show when={ LBData() !== null && LBData()!.images.length > 1 }>
            <div class={styles.carousel}>
              <For each={LBData()!.images}>
                {(image, index) => {
                  return (
                    <button onClick={() => { setSelectedImage(index) }}>
                      <img src={image.filename}></img>
                    </button>
                  )
                }}
              </For>
            </div>
          </Show>
        </div>
      </dialog>
      {props.children}
    </LightBoxContext.Provider>
  )
}