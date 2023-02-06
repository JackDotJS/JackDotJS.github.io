import isInterface from './is-interface';

const interactablesQuery = `a, input, button, textarea`;
const sections: Element[] = [];

function updateSectionVisibility() {
  const targetId = window.location.search.slice(3);
  let targetHeight = 0;

  for (const section of sections) {
    const found = (section.id == targetId);

    if (found) {
      targetHeight = section.getBoundingClientRect().height;
      section.classList.add(`visible`);
      section.removeAttribute(`aria-hidden`);
    } else {
      section.classList.remove(`visible`);
      section.setAttribute(`aria-hidden`, `true`);
    }

    const interactables = section.querySelectorAll(interactablesQuery);
    if (interactables.length > 0) {
      for (const interactable of interactables) {
        if (found) {
          interactable.removeAttribute(`tabindex`)
        } else {
          interactable.setAttribute(`tabindex`, `-1`);
        }
      }
    }
  }

  const container = document.querySelector(`#collapsibles`);
  if (container == null) return console.error(`could not find container element`);

  if (!isInterface<HTMLElement>(container, `style`)) {
    return console.error(`container is not an HTMLElement... somehow`);
  }
  
  let delay = `transition-delay: 250ms;`;
  if (parseInt(container.style.height) == 0) delay = `transition-delay: 0ms;`;

  if (targetHeight > 0) {
    container.classList.add(`visible`);
  } else {
    container.classList.remove(`visible`);
  }

  container.setAttribute(`style`, `${delay}height: ${targetHeight}px`);
};

for (const elem of document.querySelectorAll(`a[href^="?p="]`)) {
  const href = elem.getAttribute(`href`);
  if (href == null) continue;

  const elemSelector = `#` + href.slice(3);
  
  const linkedElem = document.querySelector(elemSelector);
  if (linkedElem != null) {
    sections.push(linkedElem);
  }

  elem.addEventListener(`click`, (event) => {
    event.preventDefault();

    if (window.location.search == href) {
      history.pushState({}, ``, window.location.pathname);
    } else {
      history.pushState({}, ``, href);
    }

    updateSectionVisibility();
  });
}

updateSectionVisibility();