import { useEffect, useState } from 'react';

// Isti upit kao u App.css TV sekciji — moraju da se poklapaju.
export const TV_MEDIA_QUERY =
    '(min-width: 900px) and (min-height: 520px) and (orientation: landscape)';

function mediaMatches() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }
    return window.matchMedia(TV_MEDIA_QUERY).matches;
}

export default function useTvMode() {
    const [isTv, setIsTv] = useState(mediaMatches);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return undefined;
        }

        const mediaQuery = window.matchMedia(TV_MEDIA_QUERY);
        const onChange = (event) => setIsTv(event.matches);

        setIsTv(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', onChange);
        } else {
            mediaQuery.addListener(onChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', onChange);
            } else {
                mediaQuery.removeListener(onChange);
            }
        };
    }, []);

    return isTv;
}
