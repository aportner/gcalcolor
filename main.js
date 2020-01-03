// Content script for the extension. Does all the work.

"use strict";

const observerCallback = (mutationList) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(postObserverCallbacks, observerDelay);
}

const postObserverCallbacks = () => {
  timeoutId = null;
  colorizeAll();
}

const colorizeAll = () => {
  let eventElements = document.querySelectorAll('[data-eventchip]');
  for (let eventElement of eventElements) {
    colorizeEvent(eventElement);
  }
}

let timeoutId = null;
let observerDelay = 250;
setTimeout(() => { observerDelay = 500; }, 5000);

let observer = new MutationObserver(observerCallback);
observer.observe(
  document.body,
  {
    childList: true,
    attributes: true,
    subtree: true
  }
);
