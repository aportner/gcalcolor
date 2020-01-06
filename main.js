"use strict";

var MY_NAME = '';

chrome.storage.sync.get(
  {
      name: '',
  },
  settings => {
      MY_NAME = settings.name;
  },
);


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
setTimeout(() => { observerDelay = 200; }, 5000);

let observer = new MutationObserver(observerCallback);
observer.observe(
  document.body,
  {
    childList: true,
    attributes: true,
    subtree: true
  }
);
