const images = document.querySelectorAll("#backgrounds > img");

const delay = 2500;

// wrap a given number between 0 and a max number
function wrapNumber(num, max) {
  return ((num % max) + max) % max
}

// fancy background slideshow
function changeBackground(i = 1) {
  const last1 = wrapNumber(i - 1, images.length);
  const last2 = wrapNumber(i - 2, images.length);

  images[i].style.setProperty(`z-index`, `-1000`);
  images[last1].style.setProperty(`z-index`, `-1001`);
  images[last2].style.setProperty(`z-index`, `-1002`);

  images[i].style.setProperty(`opacity`, `1`);
  images[last2].style.setProperty(`opacity`, `0`);
  

  setTimeout(() => {
    if (i+1 === images.length) {
      i = 0;
    } else {
      i++;
    }
    
    changeBackground(i);
  }, delay);
};


// start!
changeBackground();