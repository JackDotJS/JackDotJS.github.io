export {}

const interactablesQuery = `a, input, button, textarea`;
const sections: Element[] = [];

function updateSectionVisibility() {
  for (const otherElem of sections) {
    otherElem.classList.remove(`visible`);
    otherElem.setAttribute(`aria-hidden`, `true`);

    const interactables = otherElem.querySelectorAll(interactablesQuery);
    if (interactables.length > 0) {
      for (const interactable of interactables) {
        interactable.setAttribute(`tabindex`, `-1`);
      }
    }
  }

  const elemId = window.location.search.slice(3);
  if (elemId == ``) return;

  const elem = document.querySelector(`#` + elemId);
  if (elem == null) return;

  elem.classList.add(`visible`);
  elem.removeAttribute(`aria-hidden`);

  const interactables = elem.querySelectorAll(interactablesQuery);
  if (interactables.length > 0) {
    for (const interactable of interactables) {
      interactable.removeAttribute(`tabindex`);
    }
  }
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