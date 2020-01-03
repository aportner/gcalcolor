// Content script for the extension. Does all the work.

"use strict";

const HIDE = [
  [246, 191, 38],
  [167, 155, 142],
];

const MY_NAME = 'Andrew';
const NAME_REGEXES = [
  new RegExp('^' + MY_NAME + ' / (\\w+)'),
  new RegExp('(\\w+) / ' + MY_NAME),
  new RegExp('^' + MY_NAME + ',\\s?(\\w+)$'),
  new RegExp('^' + MY_NAME + ' <1:1> (\\w+)'),
  new RegExp('^(\\w+):' + MY_NAME)
];
const ONE_ON_ONE_PREFIX = '😀';

const colorize = function(color) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

const checkChildren = function(el) {
  if (!el) {
    return false;
  }

  const tagName = el.tagName.toLowerCase();

  if (tagName === 'svg') {
    return true;
  } else if (tagName === 'span' || tagName === 'div') {
    const style = getComputedStyle(el);

    if (style.textDecoration.indexOf('line-through') !== -1) {
      return true;
    }
  }

  if (el.childElementCount) {
    for (let child of el.children) {
      if (checkChildren(child)) {
        return true;
      }
    }
  }

  return false;
}

const shouldHide = function(event) {
  const style = event.style;
  const borderColor = style.borderColor;
  const backgroundColor = style.backgroundColor;

  if (backgroundColor === '') {
    if (checkChildren(event)) {
      return true;
    }
  }
  
  for (let hideColor of HIDE) {
    if (borderColor === colorize(hideColor)) {
      return true;
    }
  }

  const computedStyle = getComputedStyle(event);
  if (computedStyle.background.indexOf('linear-gradient') !== -1) {
    return true;
  }

  return false;
}

const isOneOnOne = function(el) {
  const tagName = el.tagName.toLowerCase();

  if (tagName === 'span') {
    const text = el.innerText;

    for (let regex of NAME_REGEXES) {
      const result = regex.exec(text);
      if (result) {
        return [el, regex, result];
      }
    }
  }

  if (el.childElementCount) {
    for (let child of el.children) {
      const result = isOneOnOne(child);
      if (result) {
        return result;
      }
    }
  }

  return false;
}

// Colorizes an event element. Finds the colored dot, then sets the
// overall color to that dot's color (which is its borderColor; the
// dot is just an empty 0x0 element with a circular border). Also
// hides the dot, since it is no longer needed to show the color, and
// reduces padding to help line up events and let you see more of
// their names.
function colorizeEvent(event) {
  if (shouldHide(event)) {
    event.style.opacity = 0.5;
    event.style.zIndex = 0;
  }

  const oneOnOne = isOneOnOne(event);
  if (oneOnOne) {
    const span = oneOnOne[0];
    const name = oneOnOne[2][1];

    span.innerText = `${ONE_ON_ONE_PREFIX} ${name} 1:1`;
  }
}

// Colorizes all visible events.
function colorizeAll() {
  let eventElements = document.querySelectorAll('[data-eventchip]');
  for (let eventElement of eventElements) {
    colorizeEvent(eventElement);
  }
}


// We don't have a precise way to know when Google Calendar has drawn
// some new events on the screen. Instead we use a MutationObserver to
// watch for DOM changes anywhere on the page. It would be really
// inefficient to run colorizeAll every time we got an observer
// callback, so instead we wait for a short delay to see if any more
// callbacks happen. If so, we reset the timer and wait again. We call
// colorizeAll only when the timer completes without another callback.
//
// Because there are a lot of irregularly timed screen updates when
// the page is first being loaded, we set the delay to a quarter second
// at first. After five seconds, we set it to 20 milliseconds for a
// faster response to small updates.

let timeoutId = null;
let observerDelay = 250;
setTimeout(() => { observerDelay = 500; }, 5000);

function postObserverCallbacks() {
  timeoutId = null;
  colorizeAll();
}

function observerCallback(mutationList) {
  if (timeoutId)
    clearTimeout(timeoutId);
  timeoutId = setTimeout(postObserverCallbacks, observerDelay);
}

let observer = new MutationObserver(observerCallback);
observer.observe(
  document.body,
  {
    childList: true,
    attributes: true,
    subtree: true
  }
);
