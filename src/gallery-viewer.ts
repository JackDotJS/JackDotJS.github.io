import isInterface from './is-interface';

let prevElem: Element | null;
const viewer = document.querySelector(`#viewer-container`);

function resetActiveElem() {
  if (prevElem != null && isInterface<HTMLElement>(prevElem, `focus`)) {
    prevElem.focus();
  }
}

viewer?.addEventListener(`click`, (event) => {
  event.preventDefault();

  viewer.classList.remove(`visible`);
  resetActiveElem();
});

viewer?.addEventListener(`keydown`, (event) => {
  event.preventDefault();

  if (!isInterface<KeyboardEvent>(event, `key`)) return;

  if (event.key == `Enter`) {
    viewer.classList.remove(`visible`);
    resetActiveElem();
  }
});

for (const elem of document.querySelectorAll(`.g-img-container`)) {
  if (viewer == null) {
    console.error(`could not find image viewer`);
    break;
  }

  elem.addEventListener(`click`, (event) => {
    event.preventDefault();

    const targetImageSrc = elem.querySelector(`img`)?.getAttribute(`src`);
    const targetDesc = elem.parentElement?.querySelector(`p`);
    const targetDate = elem.parentElement?.querySelector(`time`);

    const viewerImage = viewer.querySelector(`img`);
    const viewerDesc = viewer.querySelector(`p`);
    const viewerDate = viewer.querySelector(`time`);

    if (viewerImage != null && targetImageSrc != null) {
      viewerImage.setAttribute(`src`, targetImageSrc);
    }

    if (viewerDesc != null && targetDesc != null) {
      viewerDesc.textContent = targetDesc.textContent;
    }

    if (viewerDate != null && targetDate != null) {
      viewerDate.textContent = targetDate.textContent;
      if (targetDate.textContent != null) {
        viewerDate.setAttribute(`datetime`, targetDate.textContent);
      }
    }

    prevElem = document.activeElement;

    if (!isInterface<HTMLElement>(viewer, `focus`)) return;

    viewer.focus();
    viewer.classList.add(`visible`);
  });
}