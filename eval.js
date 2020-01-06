const CHINA_EMOJI = '🇨🇳';

function colorizeEvent(event) {
    const computedStyle = getComputedStyle(event);
    const style = event.style;
    const backgroundColor = style.backgroundColor;

    // hide 'maybe' and declined events
    if (computedStyle.background.indexOf('linear-gradient') !== -1
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
        const OPACITY = 0.3;

        if (event.style.opacity === '') {
            event.style.opacity = OPACITY;
            event.style.zIndex = 0;
        }

        event.onmouseenter = () => {
            event.style.opacity = 0.7;
            event.style.zIndex = 5;
        }

        event.onmouseleave = () => {
            event.style.opacity = OPACITY;
            event.style.zIndex = 0;
        }
    }

    const nameRegexes = [
        new RegExp('^' + MY_NAME + ' / (\\w+)'),
        new RegExp('(\\w+) / ' + MY_NAME),
        new RegExp('^' + MY_NAME + ',\\s?(\\w+)$'),
        new RegExp('^' + MY_NAME + ' <1:1> (\\w+)'),
        new RegExp('^(\\w+):' + MY_NAME)
    ];

    const oneOnOne = childTextMatch(event, nameRegexes);
    if (oneOnOne) {
        const span = oneOnOne[0];
        const name = oneOnOne[2][1];
    
        span.innerText = `😀 ${name} 1:1`;
    }

    const phoneScreen = childTextMatch(
        event,
        [
            /Hiring Manager Phone Screen - (.*)/,
            /Call (.*)/,
        ],
    );
    if (phoneScreen) {
        const span = phoneScreen[0];
        const name = phoneScreen[2][1];

        span.innerText = `☎️ ${name}`;
    }

    const interview = childTextMatch(
        event,
        /On.?site Interview - (.*)/,
    );
    if (interview) {
        const span = interview[0];
        const name = interview[2][1];

        span.innerText = `🎙 ${name}`;
    }

    const china = childTextMatch(event, /China/i);
    if (china) {
        const span = china[0];
        
        if (span.innerText.substr(0, CHINA_EMOJI.length) !== CHINA_EMOJI) {
            span.innerText = CHINA_EMOJI + ' ' + span.innerText;
        }
    }
}