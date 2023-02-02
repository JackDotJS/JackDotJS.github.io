import isInterface from './is-interface';

const images = document.querySelectorAll("#backgrounds > img");

console.debug(images);

const delay = 2500;

// wrap a given number between 0 and a max number
function wrapNumber(num: number, max: number) {
  return ((num % max) + max) % max
}

// fancy background slideshow
export default function changeBackground(i = 0) {
  const next = images[i];
  const last1 = images[wrapNumber(i - 1, images.length)];
  const last2 = images[wrapNumber(i - 2, images.length)];

  if (!isInterface<HTMLElement>(next, `style`)) return;
  if (!isInterface<HTMLElement>(last1, `style`)) return;
  if (!isInterface<HTMLElement>(last2, `style`)) return;

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
    
    changeBackground(i);
  }, delay);
};