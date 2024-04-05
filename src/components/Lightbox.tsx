import { For, type Component, createSignal, createEffect, createContext, JSXElement, Show, onMount } from 'solid-js';

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
  const [loadingState, setLoadingState] = createSignal<boolean>(true);
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
  let lightbox!: HTMLDivElement;
  let viewport!: HTMLCanvasElement;

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

  const clearViewerImage = () => {
    const ctx = viewport.getContext(`2d`);

    if (!(ctx instanceof CanvasRenderingContext2D)) {
      return console.error(`incorrect canvas context, something is broken!`, ctx);
    }

    ctx.clearRect(0, 0, viewport.width, viewport.height);
  }

  const loadViewerImage = (index: number) => {
    const gdata = LBData();
    if (gdata == null) return;

    setLoadingState(true);
    clearViewerImage();
    viewerImage.src = LBData()!.images[selectedImage()].filename;
    viewerImage.onload = () => {
      setLoadingState(false);
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

  const toggleFullscreen = () => {
    if (document.fullscreenElement === lightbox) {
      document.exitFullscreen()
    } else {
      lightbox.requestFullscreen()
    }
  }

  const getImageDate = () => {
    const gdata = LBData();

    if (gdata == null) {
      console.error(`missing LBData!`)
      return { year: `[...]`, month: `[...]` }
    };

    const rawValue = LBData()!.images[selectedImage()].year
    const year = Math.floor(rawValue);
    const month = parseInt(rawValue.toString().split(`.`)[1]);

    return {
      year: year.toString(),
      month: new Date(year, month, 0).toLocaleString(`en`, { month: `long` })
    }
  }

  const resizeHandler = () => {
    setCanvasWidth(document.documentElement.clientWidth);
    setCanvasHeight(document.documentElement.clientHeight);
    redrawViewerImage();
  }

  const showUiHandler = () => {
    setUiVisible(true);
  }

  onMount(() => {
    createEffect(() => {
      loadViewerImage(selectedImage());
    });
  
    createEffect(() => {
      const gdata = LBData();
  
      if (gdata !== null) {
        //console.debug(`lightbox opened`);
        setLoadingState(true);
  
        window.addEventListener(`resize`, resizeHandler);
        resizeHandler();
  
        //window.addEventListener(`pointermove`, showUiHandler);
        window.addEventListener(`keydown`, showUiHandler);
        window.addEventListener(`pointerdown`, showUiHandler);
  
        document.documentElement.style.overflow = `hidden`;
        document.body.style.overflow = `hidden`;
        
        setSelectedImage(0);

        showUiHandler();
      }
      
      if (gdata === null) {
        //console.debug(`lightbox closed`);
        window.removeEventListener(`resize`, resizeHandler);
  
        //window.removeEventListener(`pointermove`, showUiHandler);
        window.removeEventListener(`keydown`, showUiHandler);
        window.removeEventListener(`pointerdown`, showUiHandler);
  
        document.documentElement.style.overflow = ``;
        document.body.style.overflow = ``;
  
        setUiVisible(true);
  
        if (document.fullscreenElement === lightbox) {
          document.exitFullscreen();
        }
      }
    });
  });

  return (
    <LightBoxContext.Provider value={{LBData, setLBData}}>
      <div classList={{ [styles.lightbox]: true, [styles.activated]: LBData() !== null, [styles.hideUI]: !(uiVisible()) }} ref={lightbox}>
        <Show when={ LBData() !== null }>
          <canvas class={styles.viewport} width={canvasWidth()} height={canvasHeight()} ref={viewport}></canvas>
          <Show when={loadingState()}>
            <div class={styles.loadingOverlay}></div>
          </Show>
          <div class={styles.topBar}>
            <div class={styles.summary}>
              <h1>{ LBData()!.title }</h1>
              <span>{ LBData()!.description }</span>
            </div>
            <button class={styles.close} autofocus onClick={() => { setLBData(null);  }}>&times;</button>
          </div>

          <Show when={ LBData()!.images.length > 1 }>
            <button class={styles.prevButton} onClick={() => gotoPrev()}>&lt;</button>
            <button class={styles.nextButton} onClick={() => gotoNext()}>&gt;</button>
          </Show>

          <div class={styles.bottomBar}>
            <Show when={ LBData()!.images[selectedImage()] != null }>
              <div class={styles.currentImageSummary}>
                <h2>{getImageDate().month} {getImageDate().year}</h2>
                <Show when={ LBData()!.images[selectedImage()].description != null }>
                  <span>{LBData()!.images[selectedImage()].description}</span>
                </Show>
              </div>
            </Show>

            <div class={styles.controls}>
              <button>Zoom Out</button>
              <button>Reset Zoom</button>
              <button>Zoom In</button>
              <button onClick={() => setUiVisible(false)}>Hide UI</button>
              <button onClick={() => toggleFullscreen()}>Toggle Fullscreen</button>
              <button onClick={() => window.location.replace(LBData()!.images[selectedImage()].filename)}>View Original</button>
            </div>
            
            <Show when={ LBData()!.images.length > 1 }>
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
        </Show>
      </div>
      {props.children}
    </LightBoxContext.Provider>
  )
}