// ==UserScript==
// @name        Watch later v1 youtube.com
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 25/04/2024, 4:56:38 am
// @downloadURL https://github.com/ngtantai1001/userscript/raw/main/src/Watch%20later%20v1%20youtube.com.user.js
// @updateURL   https://github.com/ngtantai1001/userscript/raw/main/src/Watch%20later%20v1%20youtube.com.user.js
// ==/UserScript==

//#region todo
/**
 * Page
 * https://www.youtube.com/
 * https://www.youtube.com/playlist?list=WL
 * https://www.youtube.com/watch?v=fmSxCYCieVk&list=WL&index=1
 * https://www.youtube.com/watch?v=nAKInYTIp_I&list=PLLsO3pH5RkAQNNuUS-2bJEyBs3o9HQkNd
 * https://www.youtube.com/watch?v=lj_kv9VXYMQ
 */
/**
 * Cache videoId setVideoId
 */
/**
 * moveToAfter 10 nth press 1
 * moveToAfter 20 nth press 2
 * moveToAfter 30 nth press 3
 * moveToAfter 40 nth press 4
 * moveToAfter 50 nth press 5
 */
/**
 * press Z restore
 */
/**
 * get setVideoId
 * cache videoId setVideoId localStorage
 */

//#endregion 



DEBUG = true
const element_mouse_hover_nodeNames = [
    'ytd-rich-grid-media',
    'ytd-playlist-video-renderer',


    'ytd-rich-item-renderer',
    'ytd-rich-grid-media',

    'ytd-rich-item-renderer',
    'ytd-rich-grid-slim-media',

    'ytd-video-renderer',
    'ytd-grid-video-renderer',


    'ytd-reel-item-renderer',


    'ytd-grid-video-renderer',

    'ytd-grid-playlist-renderer',

    'ytd-reel-video-renderer',


    'ytd-compact-video-renderer',

    'ytd-playlist-panel-video-renderer',

    '[id="primary-inner"]',

    'ytd-watch-metadata',

    'ytd-video-preview',
    'ytd-compact-infocard-renderer',




    '.ytp-videowall-still',
]

// on press A add to watch later
// on press D delete from watch later
// on press Q move top
// on press E move bottom
document.addEventListener('keydown', async function (e) {
    if (e.key === 'w' && e.altKey) {
        window.location.href = '/playlist?list=WL';
    }
    if (e.key === 'h' && e.altKey) {
        window.location.href = '/feed/history';
    }

    if (e.key === 'a' || e.key === 'd') {
        console.log(e.key);

        let element = getElementMouseHover();
        if (!element) return;

        flash(element);

        let done = false;

        try {
            let videoId = getVideoIdFromElement(element);
            if (e.key === 'a') {
                await apiRestful_addToWatchLater(videoId);
            }
            if (e.key === 'd') {
                await apiRestful_removeFromWatchLater(videoId);
            }
            flash(element, 'green');
            done = true;
        } catch (error) {
            flash(element, 'red');
            done = false;
        }

        if (done === false) {
            if (e.key === 'a') await interactUI_addToWatchLater().then(flash(element, 'green'));
            if (e.key === 'd') await interactUI_removeFromWatchLater().then(flash(element, 'green'));
        }
    }


    if (e.key === 'q') {
        interactUI_moveToTop();
        moveToTop_restApi_addRemoveWatchlaLater();
        console.log(e.key);
    }

    if (e.key === 'e') {
        interactUI_moveToBottom();
        console.log(e.key);
    }

    if ((e.key === 'j' || e.key === 'l') && e.altKey == true) {
        try {
            console.log(e.key);
            let ytdplaylistpanelvideoList = [];
            document.querySelectorAll('ytd-playlist-video-renderer, ytd-video-renderer').forEach((el, i) => {
                let videoId = getVideoIdFromElement(el);
                let timestatus = el.querySelector('ytd-thumbnail-overlay-time-status-renderer badge-shape')?.textContent;
                let timestatusNumber = timestatus.replaceAll(':', '');
                let percentNumber = Number(el.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress')?.style?.width?.replace('%', '')) || 0;
                ytdplaylistpanelvideoList.push({ videoId, timestatus, timestatusNumber, percentNumber })
            });
            console.log(ytdplaylistpanelvideoList);

            // alt + l ten_ytdplaylistpanelvideoList sort time, get 50, random index, remove WL, add WL (add to top)
            if (e.key === 'j') {
                let ten_ytdplaylistpanelvideoList = ytdplaylistpanelvideoList.sort((a, b) => {
                    if (!a.timestatus || !b.timestatus) return 0;
                    return a.timestatusNumber > b.timestatusNumber ? 1 : -1;
                }).splice(0, 50).sort(() => Math.random() - 0.5);

                console.log(ten_ytdplaylistpanelvideoList);
                window.apiRestful_playlist = apiRestful_playlist;
                flash();

                await apiRestful_playlist(ten_ytdplaylistpanelvideoList.map(item => [
                    {
                        'removedVideoId': item.videoId,
                        'action': 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID'
                    }
                ]), 'WL');
                await apiRestful_playlist(ten_ytdplaylistpanelvideoList.map(item => [
                    {
                        'addedVideoId': item.videoId,
                        'action': 'ACTION_ADD_VIDEO'
                    }
                ]), 'WL');
                flash('green');

            }

            // alt + l ten_to_removeFromWatchlater_ytdplaylistpanelvideoList
            if (e.key === 'l') {
                let ten_to_removeFromWatchlater_ytdplaylistpanelvideoList = ytdplaylistpanelvideoList.filter(a => {
                    if (a && a.percentNumber && a.percentNumber && typeof a.percentNumber === 'number' && a.percentNumber > 80) {
                        return a;
                    }
                }).splice(0, 10);
                console.log({ ten_to_removeFromWatchlater_ytdplaylistpanelvideoList });
                flash();

                await apiRestful_playlist(ten_to_removeFromWatchlater_ytdplaylistpanelvideoList.map(item => [
                    {
                        'removedVideoId': item.videoId,
                        'action': 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID'
                    }
                ]), 'WL');
                flash('green');
            }

        } catch (error) {
            flash('red');
            console.error(error);
        }
    }


});
async function moveToTop_restApi_addRemoveWatchlaLater() {
    if (window.location.href.includes('playlist?list=WL')) return;
    let element = getElementMouseHover();
    if (!element) return;

    flash(element);

    let done = false;

    try {
        let videoId = getVideoIdFromElement(element);
        await apiRestful_removeFromWatchLater(videoId);
        await apiRestful_addToWatchLater(videoId);
        flash(element, 'green');
        done = true;
    } catch (error) {
        flash(element, 'red');
        done = false;
    }

    if (done === false) {
        await interactUI_removeFromWatchLater().then(flash(element, 'green'));
        await interactUI_addToWatchLater().then(flash(element, 'green'));
    }
}
async function interactUI_addToWatchLater() {
    let element = getElementMouseHover();
    if (!element) return

    if (element.nodeName.toLocaleLowerCase() === 'ytd-watch-metadata') {

        setTimeout(() => {
            element.querySelector('[aria-label="More actions"]')?.click();
        }, 0);
        setTimeout(() => {
            [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save/i))?.click()
        }, 50);
        setTimeout(() => {
            element.querySelector('[aria-label="Save to playlist"]')?.click();
        }, 100);
        setTimeout(() => {
            let el = [...document.querySelectorAll('tp-yt-paper-checkbox yt-formatted-string')].find(el => el.textContent.match(/Watch later/i))
            if (el) {
                let el2 = el.closest('tp-yt-paper-checkbox');
                if (!el2.hasAttribute('checked')) {
                    el.click();
                }
            }
        }, 800);
        setTimeout(() => {
            let event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);
        }, 1100);
    } else {
        setTimeout(() => {
            element.querySelector('[aria-label="Action menu"]')?.click();
        }, 10);

        setTimeout(() => {
            [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save to Watch later/i))?.click();
        }, 200);

        setTimeout(() => {
            let event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);
        }, 500);
    }
}
async function interactUI_removeFromWatchLater() {
    let element = getElementMouseHover();
    if (!element) return

    if ([].includes.call([
        'ytd-rich-grid-media', // https://www.youtube.com/
        'ytd-compact-video-renderer', // https://www.youtube.com/watch?v=fmSxCYCieVk&list=WL&index=4
        'ytd-grid-video-renderer',
        'ytd-video-renderer',
    ], element.nodeName.toLocaleLowerCase())) {

        setTimeout(() => {
            element.querySelector('[aria-label="Action menu"]')?.click();
        }, 10);
        setTimeout(() => {
            [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save to playlist/i))?.click()
        }, 200);
        setTimeout(() => {
            let el = [...document.querySelectorAll('tp-yt-paper-checkbox yt-formatted-string')].find(el => el.textContent.match(/Watch later/i))
            if (el) {
                let el2 = el.closest('tp-yt-paper-checkbox');
                if (el2.hasAttribute('checked')) {
                    el.click();
                }
            }
        }, 1000);

        setTimeout(() => {
            // document.querySelector('[aria-label="Cancel"]')?.click();

            let event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);

        }, 1200);
    }


    if ([].includes.call(['ytd-playlist-video-renderer'], element.nodeName.toLocaleLowerCase())) {

        setTimeout(() => {
            element.querySelector('[aria-label="Action menu"]')?.click();
        }, 10);
        setTimeout(() => {
            [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Remove from Watch later/i))?.click()
        }, 100);

        setTimeout(() => {
            // document.querySelector('[aria-label="Cancel"]')?.click();

            let event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);

        }, 800);
    }


    if ([].includes.call(['ytd-playlist-panel-video-renderer'], element.nodeName.toLocaleLowerCase())) {

        setTimeout(() => {
            element.querySelector('[aria-label="Action menu"]')?.click();
        }, 10);
        setTimeout(() => {
            let el = [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Remove from playlist/i))
            if (el) {
                el.click()
            } else {
                setTimeout(() => {
                    [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save to playlist/i))?.click()
                }, 200);
                setTimeout(() => {
                    let el = [...document.querySelectorAll('tp-yt-paper-checkbox yt-formatted-string')].find(el => el.textContent.match(/Watch later/i))
                    if (el) {
                        let el2 = el.closest('tp-yt-paper-checkbox');
                        if (el2.hasAttribute('checked')) {
                            el.click();
                        }
                    }
                }, 1000);

                setTimeout(() => {
                    // document.querySelector('[aria-label="Cancel"]')?.click();

                    let event = new KeyboardEvent('keydown', { key: 'Escape' });
                    document.dispatchEvent(event);
                }, 1200);
            }
        }, 50);

    }

    if (element.nodeName.toLocaleLowerCase() === 'ytd-watch-metadata') {
        // aria-label="More actions"
        setTimeout(() => {
            element.querySelector('[aria-label="More actions"]')?.click();
        }, 0);
        setTimeout(() => {
            [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save/i))?.click()
        }, 50);
        setTimeout(() => {
            element.querySelector('[aria-label="Save to playlist"]')?.click();
        }, 100);
        setTimeout(() => {
            let el = [...document.querySelectorAll('tp-yt-paper-checkbox yt-formatted-string')].find(el => el.textContent.match(/Watch later/i))
            if (el) {
                let el2 = el.closest('tp-yt-paper-checkbox');
                if (el2.hasAttribute('checked')) {
                    el.click();
                }
            }
        }, 800);
        setTimeout(() => {
            let event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);
        }, 1100);
    }



    setTimeout(() => {
        return

        let el = [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Remove from (?:Watch later|playlist)/gi));
        if (el) {
            el.click();
        } else {
            setTimeout(() => {
                [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save to playlist/i))?.click()
            }, 100);

        }
    }, 100);

    setTimeout(() => {
        let event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
    }, 1500);
}
async function interactUI_moveToTop() {
    let element = getElementMouseHover();
    if (!element) return

    // https://www.youtube.com/playlist?list=WL
    if (window.location.href.includes('playlist?list=WL')) {
        interactUI();
        function interactUI() {
            setTimeout(() => {
                element.querySelector('[aria-label="Action menu"]')?.click();
            }, 10);

            setTimeout(() => {
                [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Move to top/i))?.click();
            }, 300);
            setTimeout(() => {
                let event = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(event);
            }, 1100);
        }
        return;
    }
}
async function interactUI_moveToBottom() {
    let element = getElementMouseHover();
    if (!element) return

    // https://www.youtube.com/playlist?list=WL
    if (window.location.href.includes('playlist?list=WL')) {
        interactUI();
        function interactUI() {
            setTimeout(() => {
                element.querySelector('[aria-label="Action menu"]')?.click();
            }, 10);

            setTimeout(() => {
                [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Move to bottom/i))?.click();
                flash(element, 'green');
            }, 300);
            setTimeout(() => {
                let event = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(event);
            }, 1100);
        }
        return;
    }
}
function getElementMouseHover() {
    let DEBUGlocal = true

    let element = null;

    document.querySelectorAll(':hover').forEach((el, i) => {
        if (element) return;
        if ([].includes.call(element_mouse_hover_nodeNames, el.nodeName.toLocaleLowerCase())) {
            element = el;
        }
    });

    if (!element) {
        document.querySelectorAll(':hover').forEach((el, i) => {
            if (element) return;
            if (Array.from(el.classList).includes('ytp-videowall-still')) {
                element = el;
            }
        });
    }


    console.log('element_mouse_hover', element)

    if (element) {
        return element;
    }

}
function getVideoIdFromElement(element) {
    let videoId = null;
    try {
        if (!videoId) {
            videoId = element.innerHTML.match(/watch\?v=([\w\d_\-]+)/)[1];
        }
    } catch (error) { }
    try {
        if (!videoId) {
            videoId = element.innerHTML.match(/shorts\/([\w\d_\-]+)/)[1];
        }
    } catch (error) { }
    return videoId;
}
function flash(element = null, color = 'rgba(115, 115, 115, 0.1)') {
    if (element == null) {

        document.querySelector('#content').style.background = color;
        setTimeout(() => {
            document.querySelector('#content').style.background = '';
        }, 1111);
    } else {
        element.style.background = color;
        setTimeout(() => {
            element.style.background = '';
        }, 1111);
    }
}
const native_addToWatchLater = (videoId) => {
    const appElement = document.querySelector("ytd-app");

    if (!videoId || !appElement) {
        return;
    }

    const event = new window.CustomEvent('yt-action', {
        detail: {
            actionName: 'yt-service-request',
            returnValue: [],
            args: [{ data: {} }, ({
                clickTrackingParams: "",
                commandMetadata: { webCommandMetadata: { sendPost: true, apiUrl: "/youtubei/v1/browse/edit_playlist" } },
                playlistEditEndpoint: { playlistId: "WL", actions: [{ action: "ACTION_ADD_VIDEO", addedVideoId: videoId }] }
            })],
            optionalAction: false,
        }
    });

    appElement.dispatchEvent(event);
};
const native_removeFromWatchLater = (videoId) => {
    const appElement = document.querySelector("ytd-app");

    if (!videoId || !appElement) {
        return;
    }

    const event = new window.CustomEvent('yt-action', {
        detail: {
            actionName: 'yt-service-request',
            returnValue: [],
            args: [{ data: {} }, ({
                clickTrackingParams: "",
                commandMetadata: { webCommandMetadata: { sendPost: true, apiUrl: "/youtubei/v1/browse/edit_playlist" } },
                playlistEditEndpoint: { playlistId: "WL", actions: [{ action: "ACTION_REMOVE_VIDEO_BY_VIDEO_ID", removedVideoId: videoId }] }
            })],
            optionalAction: false,
        }
    });

    appElement.dispatchEvent(event);
};
const native_moveToTopWatchLater = (setVideoId) => {
    const appElement = document.querySelector("ytd-app");

    if (!setVideoId || !appElement) {
        return;
    }

    const event = new window.CustomEvent('yt-action', {
        detail: {
            actionName: 'yt-service-request',
            returnValue: [],
            args: [{ data: {} }, ({
                clickTrackingParams: "",
                commandMetadata: { webCommandMetadata: { sendPost: true, apiUrl: "/youtubei/v1/browse/edit_playlist" } },
                playlistEditEndpoint: { playlistId: "WL", actions: [{ action: "ACTION_MOVE_VIDEO_AFTER", setVideoId: setVideoId }] }
            })],
            optionalAction: false,
        }
    });

    appElement.dispatchEvent(event);
};
const native_moveToDownWatchLater = (setVideoId) => {
    const appElement = document.querySelector("ytd-app");

    if (!setVideoId || !appElement) {
        return;
    }

    const event = new window.CustomEvent('yt-action', {
        detail: {
            actionName: 'yt-service-request',
            returnValue: [],
            args: [{ data: {} }, ({
                clickTrackingParams: "",
                commandMetadata: { webCommandMetadata: { sendPost: true, apiUrl: "/youtubei/v1/browse/edit_playlist" } },
                playlistEditEndpoint: { playlistId: "WL", actions: [{ action: "ACTION_MOVE_VIDEO_BEFORE", setVideoId: setVideoId }] }
            })],
            optionalAction: false,
        }
    });

    appElement.dispatchEvent(event);
};
async function apiRestful_addToWatchLater(videoId) {
    return apiRestful_playlist([
        {
            'addedVideoId': videoId,
            'action': 'ACTION_ADD_VIDEO'
        }
    ], 'WL');
}
async function apiRestful_removeFromWatchLater(videoId) {
    return apiRestful_playlist([
        {
            'removedVideoId': videoId,
            'action': 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID'
        }
    ], 'WL');
}
async function apiRestful_moveToTop(setVideoId) {
    return apiRestful_playlist([
        {
            'setVideoId': setVideoId,
            'action': 'ACTION_MOVE_VIDEO_AFTER'
        }
    ]);
}
async function apiRestful_moveToDown(setVideoId) {
    return apiRestful_playlist([
        {
            'setVideoId': setVideoId,
            'action': 'ACTION_MOVE_VIDEO_BEFORE'
        }
    ]);
}
async function apiRestful_moveAfterVideo(setVideoId, setVideoIdMoveAfter) {
    return apiRestful_playlist([
        {
            'action': 'ACTION_MOVE_VIDEO_AFTER',
            'setVideoId': setVideoId,
            'movedSetVideoIdPredecessor': setVideoIdMoveAfter
        }
    ]);
}
function findAllByKey(obj, keyToFind) {
    return Object.entries(obj).reduce((acc, [key, value]) =>
        (key === keyToFind) ? acc.concat(value) :
            (typeof value === 'object') ? acc.concat(findAllByKey(value, keyToFind)) :
                acc, []);
}
async function getSApiSidHash(SAPISID, origin) {
    function sha1(str) {
        return window.crypto.subtle
            .digest("SHA-1", new TextEncoder().encode(str))
            .then((buf) => {
                return Array.prototype.map
                    .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
                    .join("")
            });
    };
    const TIMESTAMP_MS = Date.now();
    const digest = await sha1(`${TIMESTAMP_MS} ${SAPISID} ${origin}`);
    return `${TIMESTAMP_MS}_${digest}`;
}
async function apiRestful_playlist(actions, playlistId = 'WL') {
    return fetch("https://www.youtube.com/youtubei/v1/browse/edit_playlist?key=" + ytcfg.data_.INNERTUBE_API_KEY + "&prettyPrint=false", {
        "headers": {
            "accept": "*/*",
            "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
            "content-type": "application/json"
        },
        "body": JSON.stringify({
            "context": {
                "client": {
                    clientName: "WEB",
                    clientVersion: ytcfg.data_.INNERTUBE_CLIENT_VERSION
                }
            },
            "actions": actions,
            "playlistId": playlistId
        }),
        "method": "POST"
    });
}
