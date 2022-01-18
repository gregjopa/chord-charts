function getChordMark() {
    // work around for getting access to chordMark without ES module support.
    // in the future we'd like to use:
    // import { parseSong, renderSong } from "https://unpkg.com/chord-mark@0.11.0/lib/chord-mark.js";
    const globalChordMark = window["chord-mark"];

    if (!globalChordMark) {
        throw new Error(
            "Failed to find 'chord-mark' on the window global scope"
        );
    }

    return window["chord-mark"];
}

function addEventListeners() {
    document.querySelector("#songs").addEventListener("change", function () {
        const songName = this.value;
        import(`./songs/${songName}.js`).then((song) => {
            const url = new URL(window.location.href);
            url.searchParams.set("song-name", songName);
            window.history.pushState(null, null, url.toString());

            renderSelectedSong(song.default);
        });
    });
}

function renderSelectedSong(song) {
    const container = document.querySelector("#chord-chart-preview");
    if (!container) {
        throw new Error("Failed to find the song container in the DOM");
    }

    const { parseSong, renderSong } = getChordMark();
    const parsed = parseSong(song);
    const rendered = renderSong(parsed);

    container.innerHTML = rendered;
}

function getOptionsFromQueryString() {
    const allowedOptions = ["song-name"];

    const searchParams = new URLSearchParams(window.location.search);
    const validOptions = {};

    searchParams.forEach((value, key) => {
        if (allowedOptions.includes(key)) {
            validOptions[key] = value;
        }
    });

    return validOptions;
}

export function main() {
    addEventListeners();

    const { "song-name": songName } = getOptionsFromQueryString();

    if (songName) {
        document.querySelector("#songs").value = songName;

        import(`./songs/${songName}.js`).then((song) => {
            renderSelectedSong(song.default);
        });
    }
}
