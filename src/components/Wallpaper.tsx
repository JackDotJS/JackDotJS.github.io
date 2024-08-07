import type { Component, JSXElement } from 'solid-js';
import { For, onMount } from 'solid-js';

import styles from './Wallpaper.module.css';

// TODO: make more wallpapers

const wallpapers = [
  `/assets/wallpapers/jack.webp`,
  `/assets/wallpapers/code.webp`,
  `/assets/wallpapers/github.webp`,
  `/assets/wallpapers/caramel.webp`,
  `/assets/wallpapers/architecture.webp`,
  `/assets/wallpapers/cartower.webp`,
  `/assets/wallpapers/orika.webp`,
  `/assets/wallpapers/heavy.webp`,
  `/assets/wallpapers/ragdoll.webp`,
  `/assets/wallpapers/cartower.webp`,
  `/assets/wallpapers/turing.webp`,
  `/assets/wallpapers/kytalian.webp`,
];

const delay = 2500;

const Wallpaper: Component = () => {
  // this feels INCREDIBLY wrong but it seems to work so whatever
  const imageComponents: JSXElement[] = [];

  // wrap a given number between 0 and a max number
  const wrapNumber = (num: number, max: number) => {
    return ((num % max) + max) % max
  }

  // fancy slideshow
  const swapWallpaper = (i = 0, first = false) => {
    const next = imageComponents[i];
    const last1 = imageComponents[wrapNumber(i - 1, imageComponents.length)];
    const last2 = imageComponents[wrapNumber(i - 2, imageComponents.length)];
  
    if (!(next instanceof HTMLImageElement)) return;
    if (!(last1 instanceof HTMLImageElement)) return;
    if (!(last2 instanceof HTMLImageElement)) return;
  
    next.style.setProperty(`z-index`, `0`);
    last1.style.setProperty(`z-index`, `-1`);
    last2.style.setProperty(`z-index`, `-2`);
  
    next.style.setProperty(`opacity`, `1`);
    last2.style.setProperty(`opacity`, `0`);
  
    setTimeout(() => {
      if (i+1 === imageComponents.length) {
        i = 0;
      } else {
        i++;
      }
      
      swapWallpaper(i);
    }, first ? 0 : delay);
  };

  onMount(() => {
    swapWallpaper(0, true);
  })

  return (
    <div class={styles.slideshowBase} aria-hidden="true">
      <For each={wallpapers}>
        {(image) => {
          const component = <img src={image} class={styles.wallpaper}></img>
          imageComponents.push(component);
          return component;
        }}
      </For>
    </div>
  );
};

export default Wallpaper;
