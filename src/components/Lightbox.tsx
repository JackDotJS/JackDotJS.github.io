import { For, type Component, createSignal, createEffect, createContext, JSXElement, Show, onMount } from 'solid-js';

import styles from './Lightbox.module.css';

// TODO: back button to close lightbox

// TODO: pan image controls

// TODO: pinch zoom on touch screens/mobile devices

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
    posX: 0.5,
    posY: 0.5,
    scale: 1,
    default: true
  }
  let lightbox!: HTMLDivElement;
  let viewport!: HTMLCanvasElement;

  const zoomSensitivity = 0.15;
  const minZoom = 0.2;
  const maxZoom = 5;

  const redrawViewerImage = (resetTransform: boolean = false) => {
    if (viewerImage.src.length === 0) return;

    const ctx = viewport.getContext(`2d`);

    if (!(ctx instanceof CanvasRenderingContext2D)) {
      return console.error(`incorrect canvas context, something is broken!`, ctx);
    }

    ctx.clearRect(0, 0, viewport.width, viewport.height);

    const vt = viewerTransform;

    if (resetTransform || vt.default) {
      vt.default = true;

      vt.posX = 0.5;
      vt.posY = 0.5;

      let calcX = Math.min(viewport.width, viewerImage.width);
      let calcY = Math.min(viewport.height, viewerImage.height);

      calcX = Math.min(calcX, viewerImage.width * (calcY / viewerImage.height));
      calcY = Math.min(calcY, viewerImage.height * (calcX / viewerImage.width));

      vt.scale = Math.min(calcX / viewerImage.width, calcY / viewerImage.height);
    }

    const exactW = viewerImage.width * vt.scale
    const exactH = viewerImage.height * vt.scale

    const exactX = (viewport.width * vt.posX) - ((exactW) / 2);
    const exactY = (viewport.height * vt.posY)  -  ((exactH) / 2);

    ctx.drawImage(
      viewerImage, 
      exactX, 
      exactY, 
      exactW, 
      exactH
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
      redrawViewerImage(true);
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
    // fixes canvas size on mobile or when using browser zoom
    const multiplier = window.devicePixelRatio;

    setCanvasWidth(document.documentElement.clientWidth * multiplier);
    setCanvasHeight(document.documentElement.clientHeight * multiplier);
    redrawViewerImage(false);
  }

  const showUiHandler = () => {
    setUiVisible(true);
  }

  const clampZoom = (newValue: number) => {
    return Math.max(minZoom, Math.min(maxZoom, newValue));
  }

  const zoomIn = (curX: number, curY: number) => {
    viewerTransform.default = false;

    const oldScale = viewerTransform.scale;
    const newScale = clampZoom(oldScale + (zoomSensitivity * oldScale));

    const oldX = viewerTransform.posX;
    const oldY = viewerTransform.posY;

    // tysm amy for figuring out the horrific math to make this work :sob:
    const offsetX = ((newScale / oldScale) * (oldX - curX)) - (oldX - curX);
    const offsetY = ((newScale / oldScale) * (oldY - curY)) - (oldY - curY);

    const newX = oldX + offsetX;
    const newY = oldY + offsetY;

    viewerTransform.posX = newX;
    viewerTransform.posY = newY;

    viewerTransform.scale = newScale;
    redrawViewerImage();
  }

  const zoomOut = (curX: number, curY: number) => {
    viewerTransform.default = false;

    const oldScale = viewerTransform.scale;
    const newScale = clampZoom(oldScale - (zoomSensitivity * oldScale));

    const oldX = viewerTransform.posX;
    const oldY = viewerTransform.posY;

    const offsetX = (oldX - curX) - ((newScale / oldScale) * (oldX - curX));
    const offsetY = (oldY - curY) - ((newScale / oldScale) * (oldY - curY));

    const newX = oldX - offsetX;
    const newY = oldY - offsetY;

    console.debug(oldScale, newScale, oldX, oldY, offsetX, offsetY, newX, newY);

    viewerTransform.posX = newX;
    viewerTransform.posY = newY;

    viewerTransform.scale = newScale;
    redrawViewerImage();
  }

  const scrollHandler = (e: WheelEvent) => {
    const multiplier = window.devicePixelRatio;

    const rX = (e.clientX* multiplier) / viewport.width;
    const rY = (e.clientY * multiplier) / viewport.height;
    Math.sign(e.deltaY) > 0 ? zoomOut(rX, rY) : zoomIn(rX, rY)
    redrawViewerImage();
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

        viewport.addEventListener(`wheel`, scrollHandler);
  
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

        viewport?.removeEventListener(`wheel`, scrollHandler);
  
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
              <button onClick={() => zoomOut(0.5, 0.5)}>Zoom Out</button>
              <button onClick={() => redrawViewerImage(true)}>Reset View</button>
              <button onClick={() => zoomIn(0.5, 0.5)}>Zoom In</button>
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