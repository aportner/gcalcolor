const HIDE_COLORS = [
    'rgb(246, 191, 38)',
    'rgb(167, 155, 142)',
];
const MY_NAME = 'Andrew';
const NAME_REGEXES = [
  new RegExp('^' + MY_NAME + ' / (\\w+)'),
  new RegExp('(\\w+) / ' + MY_NAME),
  new RegExp('^' + MY_NAME + ',\\s?(\\w+)$'),
  new RegExp('^' + MY_NAME + ' <1:1> (\\w+)'),
  new RegExp('^(\\w+):' + MY_NAME)
];

function colorizeEvent(event) {
    const computedStyle = getComputedStyle(event);
    const style = event.style;
    const backgroundColor = style.backgroundColor;
    const borderColor = style.borderColor;

    if (HIDE_COLORS.indexOf(borderColor) !== -1
        || computedStyle.background.indexOf('linear-gradient') !== -1
        || backgroundColor === ''
        && childMatch(
            event,
            el => {
                return el.tagName === 'svg'
                    || el.tagName === 'SPAN'
                    && getComputedStyle(el)
                        .textDecoration
                        .indexOf('line-through') !== -1;
            }
        )
    ) {
        event.style.opacity = 0.5;
        event.style.zIndex = 0;
    }

    const oneOnOne = childTextMatch(event, NAME_REGEXES);
    if (oneOnOne) {
        const span = oneOnOne[0];
        const name = oneOnOne[2][1];
    
        span.innerText = `😀 ${name} 1:1`;
    }

    const phoneScreen = childTextMatch(
        event,
        /Hiring Manager Phone Screen - (.*)/,
    );
    if (phoneScreen) {
        const span = phoneScreen[0];
        const name = phoneScreen[2][1];

        span.innerText = `☎️ ${name}`;
    }

    const interview = childTextMatch(
        event,
        /Onsite Interview - (.*)/,
    );
    if (interview) {
        const span = interview[0];
        const name = interview[2][1];

        span.innerText = `🎙 ${name}`;
    }
}