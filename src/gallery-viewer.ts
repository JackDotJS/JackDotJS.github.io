let prevElem: Element | null;
const viewer = document.querySelector(`#viewer-container`);

function resetActiveElem() {
  if (prevElem != null && prevElem instanceof HTMLElement) {
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

  if (!(event instanceof KeyboardEvent)) return;

  if (event.key == `Enter`) {
    viewer.classList.remove(`visible`);
    resetActiveElem();
  }
});

for (const elem of document.querySelectorAll(`.g-item-container`)) {
  if (viewer == null) {
    console.error(`could not find image viewer`);
    break;
  }

  elem.addEventListener(`click`, (event) => {
    event.preventDefault();

    const targetImageSrc = elem.querySelector(`img`)?.getAttribute(`src`);
    const targetDesc = elem.querySelector(`p`);
    const targetDate = elem.querySelector(`time`);

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

    if (!(viewer instanceof HTMLElement)) return;

    viewer.focus();
    viewer.classList.add(`visible`);
  });
}

export {}