import { For, type Component, createSignal, createEffect, onMount, createContext, JSXElement, Show } from 'solid-js';

import styles from './Lightbox.module.css';

// TODO: detailed descriptions for every gallery entry?

// TODO: make sure pressing back button to close lightbox works!!!

// TODO: lightbox controls: zoom in/out, pan, next/prev img, close

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
  const [images, setImages] = createSignal<GalleryEntryImageData[]>([]);
  const [selectedImage, setSelectedImage] = createSignal<GalleryEntryImageData>();
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
    const selected = selectedImage();

    if (selected != null) loadViewerImage(selectedImage()!.filename);
  });

  createEffect(() => {
    const imageList = images();

    if (imageList.length > 0 && !lightbox.open) {
      // TODO: dont show modal until first image has loaded
      console.debug(`lightbox opened`);
      setSelectedImage(images()[0]);
      restartUIFade();
      lightbox.showModal();
    }
    
    if (imageList.length === 0 && lightbox.open) {
      // TODO: clear canvas data on close
      console.debug(`lightbox closed`);
      lightbox.close();
    }
  });

  return (
    <LightBoxContext.Provider value={{images, setImages}}>
      <dialog class={ uiVisible() ? styles.lightbox : styles.lightboxNoUi } ref={lightbox}>
        <div class={styles.lbTopBar}>
          <button autofocus onClick={() => { setImages([]) }}>Close</button>
        </div>

        <canvas class={styles.viewport} width={canvasWidth()} height={canvasHeight()} ref={viewport}></canvas>

        <div class={styles.lbBotBar}>
          <Show when={ images().length > 1 }>
            <div class={styles.carousel}>
              <For each={images()}>
                {(image) => {
                  return (
                    <button onClick={() => { setSelectedImage(image) }}>
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