import isInterface from './is-interface';
import startSlideshow from './animate-bg';

import(`./collapsible-sections`);
import(`./gallery-viewer`);

history.scrollRestoration = `auto`;

// epic super cool page open animation

function updateAnimLogoPos() {
  const animMain = document.querySelector(`main`);
  const animLogo = document.querySelector(`#logoAnim`);

  if (animLogo != null && animMain != null) {
    if (!isInterface<HTMLElement>(animLogo, `style`)) return;
    if (!isInterface<HTMLElement>(animMain, `style`)) return;

    const windowHeight = window.innerHeight;
    const mainRect = animMain.getBoundingClientRect();

    //console.debug(windowHeight, mainRect.top);

    animLogo.setAttribute(`style`, `top: ${(windowHeight / 2) - mainRect.top}px;`)
  }
}

updateAnimLogoPos();
window.addEventListener(`load`, updateAnimLogoPos);
window.addEventListener(`resize`, updateAnimLogoPos);
window.addEventListener(`scroll`, updateAnimLogoPos);

// sets up build date and rev hash in footer

let ghbuild: Date;
let ghrev: string;

Promise.all([
  fetch(`gha-build.txt`),
  fetch(`gha-hash.txt`)
]).then(async (results) => {
  for (const i in results) {
    const request = results[i];

    if (request.status !== 200) console.error(request.status);

    const text = await request.text();

    if (i === `0`) {
      // get build date
      const num = parseInt(text);
      if (isNaN(num)) return console.warn(`gha-build: ${num}`);
      ghbuild = new Date(num * 1000);

      console.log(`got build date:`, ghbuild.toUTCString().trim());
    } else {
      // get rev hash
      ghrev = text.trim();
      console.log(`got revision hash:`, ghrev);
    }
  }

  const buildelem = document.querySelector(`#gh-build`);
  const revelem = document.querySelector(`#gh-rev`);

  if (buildelem != null) {
    buildelem.setAttribute(`datetime`, ghbuild.toISOString());
    buildelem.textContent = ghbuild.toUTCString().toLowerCase(); // because uppercase letters are spooky
  }

  if (revelem != null) {
    revelem.textContent = ghrev;
    revelem.setAttribute(`href`, `https://github.com/JackDotJS/JackDotJS.github.io/commit/${ghrev}`);
  }
}).catch(console.warn);

// start bg animation

startSlideshow();

// shows my local time and updates it in (sort of) real-time

function updateMyTime() {
  const tz = document.querySelector(`#mytime`);

  if (tz != null) {
    tz.textContent = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: `America/Los_Angeles`
    });
  }
}

updateMyTime();
setInterval(updateMyTime, 1000);