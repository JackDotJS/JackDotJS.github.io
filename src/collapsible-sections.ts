export {}

const sections: Element[] = [];

function updateSectionVisibility() {
  for (const otherElems of sections) {
    otherElems.classList.remove(`visible`);
  }

  const elemId = window.location.search.slice(3);
  if (elemId == ``) return;

  const elem = document.querySelector(`#` + elemId);
  if (elem == null) return;

  elem.classList.add(`visible`);
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