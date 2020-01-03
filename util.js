function childMatch(el, matcher) {
    const result = matcher(el);
    if (result) {
        return result;
    }

    if (el.childElementCount) {
        for (let child of el.children) {
            const result = childMatch(child, matcher);
            if (result) {
                return result;
            }
        }
    }

    return false;
}

function childTextMatch(el, regexes) {
    if (!Array.isArray(regexes)) {
        regexes = [regexes];
    }

    return childMatch(
        el,
        child => {
            if (child.tagName !== 'SPAN') {
                return false;
            }

            for (let regex of regexes) {
                const result = child.innerText.match(regex);
                if (result) {
                    return [child, regex, result];
                }
            }

            return false;
        }
    );
}