import type { Component } from 'solid-js';
import { For, onMount } from 'solid-js';

import styles from './Wallpaper.module.css';

const images = [
  `/public/assets/background-slideshow/background0.jpg`,
  `/public/assets/background-slideshow/background1.jpg`,
  `/public/assets/background-slideshow/background2.jpg`,
  `/public/assets/background-slideshow/background3.jpg`,
  `/public/assets/background-slideshow/background4.jpg`,
];

const delay = 2500;

// wrap a given number between 0 and a max number
function wrapNumber(num: number, max: number) {
  return ((num % max) + max) % max
}

const Wallpaper: Component = () => {
  onMount(() => {
    // literally no way this is correct but it was the first thing that came to mind
    const _select = `.${styles.wallpaper}`;
    const images = document.querySelectorAll(_select);
    console.debug(_select);

    // fancy slideshow
    const swapWallpaper = (i = 0) => {
      const next = images[i];
      const last1 = images[wrapNumber(i - 1, images.length)];
      const last2 = images[wrapNumber(i - 2, images.length)];
    
      if (!(next instanceof HTMLImageElement)) return;
      if (!(last1 instanceof HTMLImageElement)) return;
      if (!(last2 instanceof HTMLImageElement)) return;
    
      next.style.setProperty(`z-index`, `-1000`);
      last1.style.setProperty(`z-index`, `-1001`);
      last2.style.setProperty(`z-index`, `-1002`);
    
      next.style.setProperty(`opacity`, `1`);
      last2.style.setProperty(`opacity`, `0`);
      
    
      setTimeout(() => {
        if (i+1 === images.length) {
          i = 0;
        } else {
          i++;
        }
        
        swapWallpaper(i);
      }, delay);
    };
  })

  return (
    <div class={styles.slideshowBase} aria-hidden="true">
      <For each={images}>
        {(item) => <img src={item} class={styles.wallpaper}></img>}
      </For>
    </div>
  );
};

export default Wallpaper;
