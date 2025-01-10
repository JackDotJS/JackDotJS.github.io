import { For, type Component, createSignal, createEffect, createContext, JSXElement, Show, onMount, Switch } from 'solid-js';

import { IconArrowBarToLeft, IconArrowBarToRight, IconArrowsMaximize, IconArrowsMinimize, IconChevronLeft, IconChevronRight, IconEye, IconEyeOff, IconPhotoShare, IconX, IconZoomIn, IconZoomOut, IconZoomReset, IconInfoCircle } from '@tabler/icons-solidjs';

import styles from './Lightbox.module.css';

// TODO: back button to close lightbox

// TODO: touch screens/mobile device support

// TODO: accessibility in general

// TODO: 100% original image scale button

// TODO: hide fullscreen button on platforms where its not supported (e.g, iPhones)

// TODO: hide zoom in/out buttons on mobile?

// TODO: support light theme

export interface GalleryEntryImageData {
  filename: string,
  description?: string,
  year: number,
  month: number,
  index?: number
}

export interface GalleryEntryData {
  title: string,
  description: string,
  featured?: string,
  images: GalleryEntryImageData[]
}

interface PointerCache {
  id: number,
  x: number,
  y: number,
  primary: boolean
}

export const LightBoxContext = createContext();

export const Lightbox: Component<{ children: string | JSXElement }> = (props) => {
  const [LBData, setLBData] = createSignal<GalleryEntryData|null>(null);
  const [selectedImage, setSelectedImage] = createSignal<number>(0);
  const [canvasWidth, setCanvasWidth] = createSignal(document.documentElement.clientWidth);
  const [canvasHeight, setCanvasHeight] = createSignal(document.documentElement.clientHeight);
  const [uiVisible, setUiVisible] = createSignal<boolean>(true);
  const [loadingState, setLoadingState] = createSignal<boolean>(true);
  const [isFullscreen, setIsFullscreen] = createSignal<boolean>(false);
  const [modalTitle, setModalTitle] = createSignal<string>(``);
  const [modalText, setModalText] = createSignal<string>(``);

  const viewerImage = new Image();
  const zoomSensitivity = 0.15;
  const minZoom = 0.1;
  const maxZoom = 16;

  let lightbox!: HTMLDivElement;
  let viewport!: HTMLCanvasElement;
  let carouselScroller!: HTMLDivElement;
  let carousel!: HTMLDivElement;
  let oldPointerDistance: number = 0;

  const viewerTransform = {
    posX: 0.5,
    posY: 0.5,
    scale: 1,
    default: true
  }

  const panState = {
    moving: false,
    imageOffset: {
      x: 0,
      y: 0
    },
    cursorOffset: {
      x: 0,
      y: 0
    }
  }

  const activePointers: PointerCache[] = [];

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

    const imageData = LBData()!.images[selectedImage()]
    const year = imageData.year;
    const month = imageData.month

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

  const clampZoom = (inputScale: number) => {
    return Math.max(minZoom, Math.min(maxZoom, inputScale));
  }

  const clampPosition = (inputX: number, inputY: number, inputScale: number) => {
    const minVisiblePixels = 100;

    const minX = -((((viewerImage.width * inputScale) / 2) - minVisiblePixels) / viewport.width);
    const minY = -((((viewerImage.height * inputScale) / 2) - minVisiblePixels) / viewport.height);
    const maxX = Math.abs(minX) + 1;
    const maxY = Math.abs(minY) + 1;

    const clampedX = Math.max(minX, Math.min(maxX, inputX));
    const clampedY = Math.max(minY, Math.min(maxY, inputY));

    //console.debug(minX, minY, maxX, maxY, clampedX, clampedY);

    return [clampedX, clampedY];
  }

  const zoom = (curX: number, curY: number, amount = 0) => {
    viewerTransform.default = false;

    const oldScale = viewerTransform.scale;
    const newScale = clampZoom(oldScale - (amount * oldScale));

    const oldX = viewerTransform.posX;
    const oldY = viewerTransform.posY;

    // tysm amy for figuring out the horrific math to make this work :sob:
    const offsetX = ((newScale / oldScale) * (oldX - curX)) - (oldX - curX);
    const offsetY = ((newScale / oldScale) * (oldY - curY)) - (oldY - curY);
    const newX = oldX + offsetX;
    const newY = oldY + offsetY;

    // same calculations but with panState data
    // fixes weird shifting when the user pans and zooms at the same time
    if (panState.moving) {
      const curXPan = panState.cursorOffset.x;
      const curYPan = panState.cursorOffset.y;

      const oldXPan = panState.imageOffset.x;
      const oldYPan = panState.imageOffset.y;

      const offsetXPan = ((newScale / oldScale) * (oldXPan - curXPan)) - (oldXPan - curXPan);
      const offsetYPan = ((newScale / oldScale) * (oldYPan - curYPan)) - (oldYPan - curYPan);
      const newXPan = oldXPan + offsetXPan;
      const newYPan = oldYPan + offsetYPan;

      const [clampedXPan, clampedYPan] = clampPosition(newXPan, newYPan, newScale);

      panState.imageOffset.x = clampedXPan;
      panState.imageOffset.y = clampedYPan;
    }

    const [clampedX, clampedY] = clampPosition(newX, newY, newScale);

    viewerTransform.posX = clampedX;
    viewerTransform.posY = clampedY;

    viewerTransform.scale = newScale;
    redrawViewerImage();
  }

  const scrollHandler = (e: WheelEvent) => {
    const multiplier = window.devicePixelRatio;

    const rX = (e.clientX * multiplier) / viewport.width;
    const rY = (e.clientY * multiplier) / viewport.height;

    zoom(rX, rY, Math.sign(e.deltaY) * zoomSensitivity)

    redrawViewerImage();
  }

  const panImage = (curX: number, curY: number) => {
    const newPosX = panState.imageOffset.x + (curX - panState.cursorOffset.x);
    const newPosY = panState.imageOffset.y + (curY - panState.cursorOffset.y);

    const [clampedX, clampedY] = clampPosition(newPosX, newPosY, viewerTransform.scale);

    viewerTransform.posX = clampedX;
    viewerTransform.posY = clampedY;
    viewerTransform.default = false;
    redrawViewerImage();
  }

  const pointerDownHandler = (e: PointerEvent) => {
    activePointers.push({
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      primary: e.isPrimary
    });

    if (activePointers.length > 1) {
      oldPointerDistance = getAvgPointerDistance();
    }

    if (e.isPrimary) {
      panState.moving = true;

      const multiplier = window.devicePixelRatio;

      const rX = (e.clientX * multiplier) / viewport.width;
      const rY = (e.clientY * multiplier) / viewport.height;

      panState.cursorOffset.x = rX;
      panState.cursorOffset.y = rY;
      panState.imageOffset.x = viewerTransform.posX;
      panState.imageOffset.y = viewerTransform.posY;
    }
  }

  const pointerMoveHandler = (e: PointerEvent) => {
    // update pointer positions
    for (const i in activePointers) {
      const p = activePointers[i];
      if (p.id === e.pointerId) {
        p.x = e.clientX;
        p.y = e.clientY;
      }
    }

    if (panState.moving) {
      // get primary pointer position
      // makes touchscreen behavior less weird
      let x = 0;
      let y = 0;

      for (const p of activePointers) {
        if (!p.primary) continue;
        x = p.x;
        y = p.y;
      }

      const multiplier = window.devicePixelRatio;
      const rX = (x * multiplier) / viewport.width;
      const rY = (y * multiplier) / viewport.height;

      panImage(rX, rY);

      // handle pinch zoom on touch devices
      const avgDist = getAvgPointerDistance();

      if (activePointers.length > 1 && avgDist !== oldPointerDistance) {
        zoom(rX, rY, 0.0075 * (oldPointerDistance - avgDist));
      }

      oldPointerDistance = avgDist;
    }
  }

  const pointerUpHandler = (e: PointerEvent) => {
    for (let i = 0; i < activePointers.length; i++) {
      const p = activePointers[i];
      if (p.id === e.pointerId) {
        activePointers.splice(i, 1);
      }
    }

    panState.moving = false;
  }

  const updateCarousel = () => {
    if (carousel == null || carouselScroller == null) return;
    if (!carousel.isConnected || !carouselScroller.isConnected) return;

    const buttons = carouselScroller.children;
    const firstItem = buttons[0];

    const wrapperRect = carousel.getBoundingClientRect();
    const firstItemRect = firstItem.getBoundingClientRect();

    const centerWrapper = wrapperRect.width / 2;
    const firstItemOffset = centerWrapper - (firstItemRect.width / 2);

    carouselScroller.style.padding = `0px ${firstItemOffset}px`;

    carousel.scrollTo({
      left: ((carousel.scrollWidth - carousel.clientWidth) / (LBData()!.images.length - 1)) * selectedImage(),
      behavior: 'smooth'
    });
  };

  const getAvgPointerDistance = () => {
    let avgDist: number = 0;
    
    let primX = 0;
    let primY = 0;

    for (const p of activePointers) {
      if (!p.primary) continue;
      primX = p.x;
      primY = p.y;
    }

    for (const p of activePointers) {
      const distance = Math.sqrt(((p.x - primX)**2) + ((p.y - primY)**2));

      avgDist += distance;
    }

    return avgDist / activePointers.length;
  };

  const fullscreenUpdate = () => {
    setIsFullscreen(document.fullscreenElement === lightbox);
  };

  onMount(() => {
    createEffect(() => {
      const gdata = LBData();
      if (gdata == null) return;

      loadViewerImage(selectedImage());
      updateCarousel();
    });
  
    createEffect(() => {
      const gdata = LBData();
  
      if (gdata !== null) {
        console.debug(`lightbox opened`);
        setLoadingState(true);

        // gallery carousel
        window.addEventListener(`resize`, updateCarousel);
  
        // window resizing
        window.addEventListener(`resize`, resizeHandler);
        resizeHandler();

        // scrollwheel zoom
        viewport.addEventListener(`wheel`, scrollHandler);
  
        // panning controls
        // touch zoom controls
        viewport.addEventListener(`pointerdown`, pointerDownHandler);
        window.addEventListener(`pointermove`, pointerMoveHandler);
        window.addEventListener(`pointerup`, pointerUpHandler);
        window.addEventListener(`pointercancel`, pointerUpHandler);

        document.addEventListener(`fullscreenchange`, fullscreenUpdate)
        
        // prevent regular page scrolling
        document.documentElement.style.overflow = `hidden`;
        document.body.style.overflow = `hidden`;
        
        setSelectedImage(0);

        showUiHandler();
      }
      
      if (gdata === null) {
        console.debug(`lightbox closed`);

        // gallery carousel
        window.removeEventListener(`resize`, updateCarousel);
  
        // window resizing
        window.removeEventListener(`resize`, resizeHandler);
        resizeHandler();

        // scrollwheel zoom
        if (viewport != null) viewport.removeEventListener(`wheel`, scrollHandler);
  
        // panning controls
        // touch zoom controls
        if (viewport != null) viewport.removeEventListener(`pointerdown`, pointerDownHandler);
        window.removeEventListener(`pointermove`, pointerMoveHandler);
        window.removeEventListener(`pointerup`, pointerUpHandler);
        window.removeEventListener(`pointercancel`, pointerUpHandler);
  
        // re-enable regular page scrolling
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
          <button 
            title="Show UI"
            class={styles.showUIButton} 
            onClick={() => setUiVisible(true)}
          >
            <IconEye/>
          </button>
          <Show when={loadingState()}>
            <div class={styles.loadingOverlay}></div>
          </Show>
          <div class={styles.topBar}>
            <div class={styles.summary}>
              <div>
                <h1>{ LBData()!.title }</h1>
                <Show when={ LBData()!.description.length > 0 }>
                  <button
                    title="Show Description" 
                    onClick={() => { 
                      setModalTitle(LBData()!.title);
                      setModalText(LBData()!.description);
                    }}
                  >
                    <IconInfoCircle size="66%"/>
                  </button>
                </Show>
              </div>
              <Show when={ LBData()!.images.length > 1 }>
                <h2>{ `${LBData()!.images.length} images` }</h2>
              </Show>
            </div>
            <button
              title="Close"  
              class={styles.close} 
              autofocus 
              onClick={() => { setLBData(null); }}
            >
              <IconX size="50%"/>
            </button>
          </div>

          <Show when={ LBData()!.images.length > 1 }>
            <button class={styles.prevButton} onClick={() => gotoPrev()}>
              <IconChevronLeft size="100%"/>
            </button>
            <button class={styles.nextButton} onClick={() => gotoNext()}>
              <IconChevronRight size="100%"/>
            </button>
          </Show>

          <div class={styles.bottomBar}>
            <Show when={ LBData()!.images[selectedImage()] != null }>
              <div class={styles.currentImageSummary}>
                <h2>{getImageDate().month} {getImageDate().year}</h2>
                <Show when={ LBData()!.images[selectedImage()].description != null }>
                  <button 
                    title="Show Description" 
                    onClick={() => { 
                      setModalTitle(`${getImageDate().month} ${getImageDate().year}`);
                      setModalText(LBData()!.images[selectedImage()].description!); 
                    }}
                  >
                    <IconInfoCircle size="66%"/>
                  </button>
                </Show>
              </div>
            </Show>

            <div class={styles.controls}>
              <button
                title="Jump to Start" 
                onClick={() => setSelectedImage(0)}>
                <IconArrowBarToLeft/>
              </button>
              <button 
                title="Zoom Out"
                onClick={() => zoom(0.5, 0.5, zoomSensitivity)}>
                <IconZoomOut/>
              </button>
              <button
                title="Reset View" 
                onClick={() => redrawViewerImage(true)}>
                <IconZoomReset/>
              </button>
              <button
                title="Zoom In" 
                onClick={() => zoom(0.5, 0.5, -zoomSensitivity)}>
                <IconZoomIn/>
              </button>
              <button
                title="Hide UI" 
                onClick={() => setUiVisible(false)}>
                <IconEyeOff/>
              </button>
              <button
                title="Toggle Fullscreen" 
                onClick={() => toggleFullscreen()}>
                  <Show 
                    when={isFullscreen()}
                    fallback={<IconArrowsMaximize/>}>
                    <IconArrowsMinimize/>
                  </Show>
                </button>
              <button
                title="View Original"
                onClick={() => window.location.replace(LBData()!.images[selectedImage()].filename)}>
                <IconPhotoShare/>
              </button>
              <button 
                title="Jump to End"
                onClick={() => setSelectedImage(LBData()!.images.length - 1)}>
                <IconArrowBarToRight/>
              </button>
            </div>
            
            <Show when={ LBData()!.images.length > 1 }>
              <div class={styles.carousel} ref={carousel}>
                <div class={styles.carouselScroller} ref={carouselScroller}>
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
              </div>
            </Show>
          </div>

          <Show when={ modalText().length > 0 }>
            <div class={styles.modalWrapper} >
              <div class={styles.modalCloseTarget} onClick={() => { setModalText(``); }}></div>
              <div class={styles.descriptionModal}>
                <div>
                  <h1>{ modalTitle() }</h1>
                  <button 
                    title="Close" 
                    autofocus 
                    onClick={() => { setModalText(``); }}
                  >
                    <IconX size="50%"/>
                  </button>
                </div>
                <p>{ modalText() }</p>
              </div>
            </div>
          </Show>
        </Show>
      </div>
      {props.children}
    </LightBoxContext.Provider>
  )
}
