// ==UserScript==
// @name        New script youtube.com
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 25/04/2024, 4:56:38 am
// ==/UserScript==

//#region todo
/**
 * Page
 * https://www.youtube.com/
 * https://www.youtube.com/playlist?list=WL
 * https://www.youtube.com/watch?v=fmSxCYCieVk&list=WL&index=1
 * https://www.youtube.com/watch?v=nAKInYTIp_I&list=PLLsO3pH5RkAQNNuUS-2bJEyBs3o9HQkNd
 * https://www.youtube.com/watch?v=lj_kv9VXYMQ
 * https://www.youtube.com/results?search_query=c%C3%A2u+c%C3%A1+hi%E1%BB%87p+ho%C3%A0&sp=CAI%253D
 */

/**
 * mobile web version
 * research test page
 */
/**
 * mini player at /playlist?list=WL position left
 */
/**
 * moveToAfter 10 nth press 1
 * moveToAfter 20 nth press 2
 * moveToAfter 30 nth press 3
 * moveToAfter 40 nth press 4
 * moveToAfter 50 nth press 5
 */

/**
 * mobile web version
 * touch 
 * 2 tap add
 * 2 tap panright add
 * 2 tap panleft delete
 * 2 tap panup move to top
 * 2 tap pandown move to top
 */

/**
 * https://greasyfork.org/en/scripts/478696-youtube-button-as-add-notify-video-to-wl/code
 */

/**
 * apirestful research howto
 * https://www.youtube.com/watch?v=caWusOZMWWI 
 *             "playlistEditVideoAddedResultData": {
                "videoId": "caWusOZMWWI",
                "setVideoId": "D7A8BDF14BE962B9"
            }
 */

//#endregion 

//#region done
/** 25042024
 * add function
 * x https://www.youtube.com/ 
 * x https://www.youtube.com/playlist?list=WL
 * x add delete https://www.youtube.com/watch?v=fmSxCYCieVk&list=WL&index=1
 * x https://www.youtube.com/watch?v=nAKInYTIp_I&list=PLLsO3pH5RkAQNNuUS-2bJEyBs3o9HQkNd
 * x https://www.youtube.com/watch?v=lj_kv9VXYMQ
 */
/** 25042024
 * delete function
 * ok all page
 * https://www.youtube.com/
 * https://www.youtube.com/playlist?list=WL
 * https://www.youtube.com/watch?v=fmSxCYCieVk&list=WL&index=1
 * https://www.youtube.com/watch?v=nAKInYTIp_I&list=PLLsO3pH5RkAQNNuUS-2bJEyBs3o9HQkNd
 * https://www.youtube.com/watch?v=lj_kv9VXYMQ
 */
/** 25042024
 * move to top . make color
 * move to down . make color
 */

/** 25012024
 * on mouse hover element
 * press A add
 * press D delete
 * show color add green
 * show color delete red
 */
//#endregion


DEBUG = true
DATA = {}
DATA['element_mouse_hover_nodeNames'] = [
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

    'ytd-video-renderer',
    'ytd-reel-item-renderer',
]

// on press A add to watch later
// on press D delete from watch later
// on press Q move top
// on press E move bottom
document.addEventListener('keydown', function (e) {
    if (e.key === 'q') {
        // ['ytd-masthead',
        // 'tp-yt-app-drawer',
        // 'ytd-page-manager',]
        moveToTop();
        // apiRestful_moveToTop();
        flash()
        console.log(e.key);
    }

    if (e.key === 'e') {
        moveToDown();
        // apiRestful_moveToDown();
        flash()
        console.log(e.key);
    }

    if (e.key == 'a' || e.key == 'd') {
        let element = elementMouseHover();
        if (!element) return

        let tgVideoId = null
        if (tgVideoId == null) {
            try {
                tgVideoId = element.querySelector('a[href *= "/watch?v="]').href.match(/watch\?v=([^=&\?]+)&?/)[1];

            } catch (error) {

            }
        }
        if (tgVideoId == null) {
            try {
                tgVideoId = element.querySelector('a[href *= "/shorts/"]').href.match(/shorts\/([^\/\?]+)\/?/)[1];

            } catch (error) {

            }
        }
        if (tgVideoId == null) {
            try {
                tgVideoId = element.innerHTML.match(/watch\?v=([^=&\?]+)&?/)[0];
            } catch (error) {

            }
        }
        if (tgVideoId == null) {
            try {
                tgVideoId = element.innerHTML.match(/shorts\/([^\/\?]+)\/?/)[0];
            } catch (error) {

            }
        }

        if (tgVideoId) {
            if (e.key == 'a') {
                ytactsjson = [{
                    "action": "ACTION_ADD_VIDEO",
                    "addedVideoId": tgVideoId
                }];
            }
            if (e.key == 'd') {
                ytactsjson = [{
                    "action": "ACTION_REMOVE_VIDEO_BY_VIDEO_ID",
                    "removedVideoId": tgVideoId
                }];
            }
            console.log(ytactsjson)
            apiRestful_playlist(ytactsjson, 'WL').then(res => {
                if (res.status == 200) {
                    flash('green', element)
                } else {
                    flash('red', element)
                }
            })
        }
    }
});

function add() {
    let element = elementMouseHover();
    if (!element) return

    if (DEBUG) {
        console.log(element);
        element.style.background = 'green';
        setTimeout(() => {
            element.style.background = '';
        }, 3000)
    }

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
            [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Save to Watch later/i))?.click()
        }, 200);

        setTimeout(() => {
            let event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);
        }, 500);
    }
}

function del() {
    let element = elementMouseHover();
    if (!element) return

    if (DEBUG) {
        console.log(element);
        element.style.background = 'red';
        setTimeout(() => {
            element.style.background = '';
        }, 3000)
    }

    if ([].includes.call([
        'ytd-rich-grid-media', // https://www.youtube.com/
        'ytd-compact-video-renderer', // https://www.youtube.com/watch?v=fmSxCYCieVk&list=WL&index=4
        'ytd-grid-video-renderer',
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


}



function elementMouseHover() {
    let DEBUGlocal = true

    let element = DATA['element_mouse_hover'] = null;

    let temp = document.querySelectorAll(':hover');
    temp = [...temp];
    temp = temp.reverse();


    console.log('elements_mouse_hover', temp)

    let i = [].findIndex.call(temp, function (el) {
        // return el.nodeName.toLocaleLowerCase() == 'ytd-playlist-video-renderer';
        let check = [].includes.call(DATA['element_mouse_hover_nodeNames'], el.nodeName.toLocaleLowerCase());
        return check;
    });


    if (i) {
        element = temp[i];
    }

    console.log('element_mouse_hover', element)

    if (element) {
        return element;
    }

}

function moveToTop() {
    let element = elementMouseHover();
    if (!element) return

    if (DEBUG) {
        console.log(element);
        element.style.backgroundImage = 'linear-gradient(green, transparent)';
        setTimeout(() => {
            element.style.background = '';
        }, 3000)
    }

    // https://www.youtube.com/playlist?list=WL


    setTimeout(() => {
        element.querySelector('[aria-label="Action menu"]')?.click();
    }, 10);

    setTimeout(() => {
        [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Move to top/i))?.click()
    }, 300);
}


function moveToDown() {
    let element = elementMouseHover();
    if (!element) return

    if (DEBUG) {
        console.log(element);
        element.style.backgroundImage = 'linear-gradient(transparent, green)';
        setTimeout(() => {
            element.style.background = '';
        }, 3000)
    }


    setTimeout(() => {
        element.querySelector('[aria-label="Action menu"]')?.click();
    }, 10);

    setTimeout(() => {
        [...document.querySelectorAll('yt-formatted-string')].find(el => el.textContent.match(/Move to top/i))?.click()
    }, 300);
}




function apiRestful_saveToPlaylistWatchLater() {
    return fetch('https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'SAPISIDHASH 1714018141_e531e0c5d8b6b7be6d612f4be7a79252d9a62365',
            'content-type': 'application/json',
            'dnt': '1',
            'origin': 'https://www.youtube.com',
            'priority': 'u=1, i',
            'referer': 'https://www.youtube.com/shorts/pB9y66EKXF0',
            'sec-ch-ua': '"Chromium";v="124", "Not-A.Brand";v="99", "Google Chrome";v="124"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"124.0.6367.61"',
            'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.61", "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="124.0.6367.61"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': 'Cgt2ektDNUxra3Q0WSj2sKexBjIKCgJWThIEGgAgSw%3D%3D',
            'x-origin': 'https://www.youtube.com',
            'x-youtube-bootstrap-logged-in': 'true',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20240422.01.00'
        },
        body: JSON.stringify({
            'context': {
                'client': {
                    'hl': 'en',
                    'gl': 'VN',
                    'remoteHost': '113.187.109.246',
                    'deviceMake': '',
                    'deviceModel': '',
                    'visitorData': 'Cgt2ektDNUxra3Q0WSj2sKexBjIKCgJWThIEGgAgSw%3D%3D',
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)',
                    'clientName': 'WEB',
                    'clientVersion': '2.20240422.01.00',
                    'osName': 'Windows',
                    'osVersion': '10.0',
                    'originalUrl': 'https://www.youtube.com/shorts/pB9y66EKXF0',
                    'platform': 'DESKTOP',
                    'clientFormFactor': 'UNKNOWN_FORM_FACTOR',
                    'configInfo': {
                        'appInstallData': 'CPawp7EGEKKSsAUQ4fKvBRDJ17AFEOXDsAUQieiuBRCWlbAFEO6irwUQ3oj_EhC3q7AFEKiasAUQt-CuBRDbr68FEMzfrgUQgqL_EhCTzbAFENjgsAUQ6-j-EhC-irAFEPXgsAUQ2uCwBRDHzrAFELvSrwUQj8SwBRDrk64FEMn3rwUQ9NCwBRDEw7AFEMbDsAUQkLKwBRDvzbAFENPhrwUQ3ej-EhDUoa8FEObWsAUQl4OwBRC8-a8FEKW7sAUQg9-vBRC9tq4FEIjjrwUQt--vBRC--a8FEPOhsAUQooGwBRDZya8FEParsAUQ7rOwBRCBorAFEL2ZsAUQp7uwBRCs2LAFEPyFsAUQ-9qwBRCVzbAFEMf9tyIQ0I2wBRCIh7AFENXdsAUQzdewBRCNzLAFEKO7sAUQ57qvBRCa8K8FEJ7QsAUQ6sOvBRDX6a8FEIO_sAUQ-NKwBRDViLAFELHcsAUQ4tSuBRDMw7AFEKrYsAUQ_9-wBRC36v4SENPgsAUQz6iwBRClwv4SEPSrsAUQ3t2wBRDR4LAFEPGcsAUQ4MOwBRDj0bAFEIvPsAUQppqwBRDW1rAFEMjDsAUQysOwBRD-4LAFEPTgsAUQkf23IhCWvLAFEJak_xIqIENBTVNFaFVKb0wyd0ROSGtCcUNROUF2TDFBUWRCdz09'
                    },
                    'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
                    'timeZone': 'Etc/GMT-7',
                    'browserName': 'Chrome',
                    'browserVersion': '124.0.0.0',
                    'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'deviceExperimentId': 'ChxOek0yTVRZMU16QTJPVEk1TVRnNE5UZzROdz09EPawp7EGGPawp7EG',
                    'screenWidthPoints': 1618,
                    'screenHeightPoints': 558,
                    'screenPixelDensity': 1,
                    'screenDensityFloat': 1,
                    'utcOffsetMinutes': 420,
                    'connectionType': 'CONN_CELLULAR_4G',
                    'memoryTotalKbytes': '8000000',
                    'mainAppWebInfo': {
                        'graftUrl': 'https://www.youtube.com/shorts/pB9y66EKXF0',
                        'pwaInstallabilityStatus': 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                        'webDisplayMode': 'WEB_DISPLAY_MODE_BROWSER',
                        'isWebNativeShareAvailable': true
                    }
                },
                'user': {
                    'lockedSafetyMode': false
                },
                'request': {
                    'useSsl': true,
                    'consistencyTokenJars': [
                        {
                            'encryptedTokenJarContents': 'AKreu9ux1Ufy3fZWE7msh58ZqJg-ZA1Ga5qJCHb6LjR4jZg406X908to-fj9s5qutqvfknkgNhvDjab9wpKYSxKUqI3lcA_oHOLMkxrJbITawSB3V0M2Q0xrAR0ubax31Zq3u8kzdrYQcnDC0-8hn7rim7mgPPrXthQjR9uQALaXOEhed6k2nG7g05EqL6u7_C6q7ZXHn-G-KGVOlKe5S67knc3eFhZgZn9XH9r45NwCRTM7jOB3Dln0q0hek6oX2F6TBwN0ZS1eCLshjEYgxxK2uwM8324'
                        }
                    ],
                    'internalExperimentFlags': []
                },
                'clickTracking': {
                    'clickTrackingParams': 'CAAQisQGIhMI4qT5nMDchQMVDBB7Bx1TTwvL'
                },
                'adSignalsInfo': {
                    'params': [
                        {
                            'key': 'dt',
                            'value': '1714018131882'
                        },
                        {
                            'key': 'flash',
                            'value': '0'
                        },
                        {
                            'key': 'frm',
                            'value': '0'
                        },
                        {
                            'key': 'u_tz',
                            'value': '420'
                        },
                        {
                            'key': 'u_his',
                            'value': '3'
                        },
                        {
                            'key': 'u_h',
                            'value': '1080'
                        },
                        {
                            'key': 'u_w',
                            'value': '1920'
                        },
                        {
                            'key': 'u_ah',
                            'value': '1080'
                        },
                        {
                            'key': 'u_aw',
                            'value': '1858'
                        },
                        {
                            'key': 'u_cd',
                            'value': '24'
                        },
                        {
                            'key': 'bc',
                            'value': '31'
                        },
                        {
                            'key': 'bih',
                            'value': '558'
                        },
                        {
                            'key': 'biw',
                            'value': '1618'
                        },
                        {
                            'key': 'brdim',
                            'value': '0,0,0,0,1858,0,1858,1080,1618,558'
                        },
                        {
                            'key': 'vis',
                            'value': '1'
                        },
                        {
                            'key': 'wgl',
                            'value': 'true'
                        },
                        {
                            'key': 'ca_type',
                            'value': 'image'
                        }
                    ],
                    'bid': 'ANyPxKquUfVeMS_a_lheVCXueVkQ2wmMBKjstv1HcrmEi6XFFt_yFrS3Nl5tH1rgo1nRFnqQA4gK0G3W9aU5s2TD0XGorQrIVw'
                }
            },
            'actions': [
                {
                    'addedVideoId': 'pB9y66EKXF0',
                    'action': 'ACTION_ADD_VIDEO'
                }
            ],
            'playlistId': 'WL'
        })
    });
}

function flash(color = 'rgba(255, 191, 0, 0.1)', element = null) {
    if (element == null) {

        document.querySelector('#content').style.background = color;
        setTimeout(() => {
            document.querySelector('#content').style.background = '';
        }, 300);
    } else {
        element.style.background = color;
        setTimeout(() => {
            element.style.background = '';
        }, 300);
    }
}

function apiRestfull_add() {

    return fetch('https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'SAPISIDHASH 1714025359_6da52ef7c9c2ac8f87e6fd170f7cb0201c41020e',
            'content-type': 'application/json',
            'dnt': '1',
            'origin': 'https://www.youtube.com',
            'priority': 'u=1, i',
            'referer': 'https://www.youtube.com/',
            'sec-ch-ua': '"Chromium";v="124", "Not-A.Brand";v="99", "Google Chrome";v="124"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"124.0.6367.61"',
            'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.61", "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="124.0.6367.61"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': 'Cgt2ektDNUxra3Q0WSjq6KexBjIKCgJWThIEGgAgSw%3D%3D',
            'x-origin': 'https://www.youtube.com',
            'x-youtube-bootstrap-logged-in': 'true',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20240422.01.00'
        },
        body: JSON.stringify({
            'context': {
                'client': {
                    'hl': 'en',
                    'gl': 'VN',
                    'remoteHost': '113.187.109.246',
                    'deviceMake': '',
                    'deviceModel': '',
                    'visitorData': 'Cgt2ektDNUxra3Q0WSjq6KexBjIKCgJWThIEGgAgSw%3D%3D',
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)',
                    'clientName': 'WEB',
                    'clientVersion': '2.20240422.01.00',
                    'osName': 'Windows',
                    'osVersion': '10.0',
                    'originalUrl': 'https://www.youtube.com/',
                    'platform': 'DESKTOP',
                    'clientFormFactor': 'UNKNOWN_FORM_FACTOR',
                    'configInfo': {
                        'appInstallData': 'COrop7EGEJaVsAUQqtiwBRCTzbAFEJeDsAUQzN-uBRDUoa8FEI3MsAUQydewBRDd6P4SEM-osAUQt-CuBRDxnLAFELfq_hIQ9eCwBRDeiP8SEKO7sAUQ1d2wBRC8-a8FENnJrwUQvZmwBRDa4LAFEPyFsAUQ0eCwBRDj0bAFEO6irwUQg7-wBRD-4LAFEKKSsAUQ4MOwBRDN17AFENuvrwUQ0-CwBRCx3LAFEOLUrgUQpcL-EhComrAFEO_NsAUQppqwBRD40rAFENfprwUQgqL_EhDus7AFEMrDsAUQgaKwBRC-irAFEJCysAUQvbauBRCVzbAFEIjjrwUQyfevBRCPxLAFEKzYsAUQ0-GvBRDh8q8FEOXDsAUQx_23IhC70q8FENCNsAUQmvCvBRD_37AFEOvo_hIQt6uwBRCigbAFEIvPsAUQt--vBRCIh7AFEMfOsAUQ2OCwBRDGw7AFEKW7sAUQ3t2wBRD0q7AFEPOhsAUQyMOwBRC--a8FEObWsAUQ57qvBRDqw68FEInorgUQp7uwBRD04LAFEIPfrwUQ9quwBRD00LAFENWIsAUQxMOwBRCe0LAFEOuTrgUQ-9qwBRDMw7AFENbWsAUQkf23IhCWpP8SEJa8sAUqIENBTVNFaFVKb0wyd0ROSGtCcUNROUF2TDFBUWRCdz09'
                    },
                    'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
                    'timeZone': 'Etc/GMT-7',
                    'browserName': 'Chrome',
                    'browserVersion': '124.0.0.0',
                    'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'deviceExperimentId': 'ChxOek0yTVRZNE16Z3dNalExTURRNU5qRTVOdz09EOrop7EGGOrop7EG',
                    'screenWidthPoints': 1803,
                    'screenHeightPoints': 1006,
                    'screenPixelDensity': 1,
                    'screenDensityFloat': 1,
                    'utcOffsetMinutes': 420,
                    'connectionType': 'CONN_CELLULAR_4G',
                    'memoryTotalKbytes': '8000000',
                    'mainAppWebInfo': {
                        'graftUrl': 'https://www.youtube.com/',
                        'pwaInstallabilityStatus': 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                        'webDisplayMode': 'WEB_DISPLAY_MODE_BROWSER',
                        'isWebNativeShareAvailable': true
                    }
                },
                'user': {
                    'lockedSafetyMode': false
                },
                'request': {
                    'useSsl': true,
                    'consistencyTokenJars': [
                        {
                            'encryptedTokenJarContents': 'AKreu9v1kWLLWhDFTJLYQ6z-j68lhaxOyRcqDrMahh2el_bcNOODQKdU_BOOF40NtiKsDsf9Q3A4SByPNWoB_claI-mMJCMcjZHHqNJn2V0c07aAFr4pwU9sQz6fg0PvCuUGfzxPw4sONJf5XxPDSZ4s1A0hzi3unD_bYiq7r4ld7AzJA4RTOLWFIWezGrwDKBRaOmWN-kes68m8Ui-SLdf69LVqfEM',
                            'expirationSeconds': '600'
                        }
                    ],
                    'internalExperimentFlags': []
                },
                'clickTracking': {
                    'clickTrackingParams': 'CIwCENwwIhMIgsON7trchQMV2ln1BR1iLwhF'
                },
                'adSignalsInfo': {
                    'params': [
                        {
                            'key': 'dt',
                            'value': '1714025287433'
                        },
                        {
                            'key': 'flash',
                            'value': '0'
                        },
                        {
                            'key': 'frm',
                            'value': '0'
                        },
                        {
                            'key': 'u_tz',
                            'value': '420'
                        },
                        {
                            'key': 'u_his',
                            'value': '2'
                        },
                        {
                            'key': 'u_h',
                            'value': '1080'
                        },
                        {
                            'key': 'u_w',
                            'value': '1920'
                        },
                        {
                            'key': 'u_ah',
                            'value': '1080'
                        },
                        {
                            'key': 'u_aw',
                            'value': '1858'
                        },
                        {
                            'key': 'u_cd',
                            'value': '24'
                        },
                        {
                            'key': 'bc',
                            'value': '31'
                        },
                        {
                            'key': 'bih',
                            'value': '1006'
                        },
                        {
                            'key': 'biw',
                            'value': '1788'
                        },
                        {
                            'key': 'brdim',
                            'value': '0,0,0,0,1858,0,1858,1080,1803,1006'
                        },
                        {
                            'key': 'vis',
                            'value': '1'
                        },
                        {
                            'key': 'wgl',
                            'value': 'true'
                        },
                        {
                            'key': 'ca_type',
                            'value': 'image'
                        }
                    ]
                }
            },
            'actions': [
                {
                    'addedVideoId': 'dSE0JYPgyR0',
                    'action': 'ACTION_ADD_VIDEO'
                }
            ],
            'playlistId': 'WL'
        })
    });
}

function apiRestful_del() {
    return fetch('https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'SAPISIDHASH 1714025449_1ea8d041d02cdc395cd85a1279c4909fc26dba53',
            'content-type': 'application/json',
            'dnt': '1',
            'origin': 'https://www.youtube.com',
            'priority': 'u=1, i',
            'referer': 'https://www.youtube.com/',
            'sec-ch-ua': '"Chromium";v="124", "Not-A.Brand";v="99", "Google Chrome";v="124"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"124.0.6367.61"',
            'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.61", "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="124.0.6367.61"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': 'Cgt2ektDNUxra3Q0WSjq6KexBjIKCgJWThIEGgAgSw%3D%3D',
            'x-origin': 'https://www.youtube.com',
            'x-youtube-bootstrap-logged-in': 'true',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20240422.01.00'
        },
        body: JSON.stringify({
            'context': {
                'client': {
                    'hl': 'en',
                    'gl': 'VN',
                    'remoteHost': '113.187.109.246',
                    'deviceMake': '',
                    'deviceModel': '',
                    'visitorData': 'Cgt2ektDNUxra3Q0WSjq6KexBjIKCgJWThIEGgAgSw%3D%3D',
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)',
                    'clientName': 'WEB',
                    'clientVersion': '2.20240422.01.00',
                    'osName': 'Windows',
                    'osVersion': '10.0',
                    'originalUrl': 'https://www.youtube.com/',
                    'platform': 'DESKTOP',
                    'clientFormFactor': 'UNKNOWN_FORM_FACTOR',
                    'configInfo': {
                        'appInstallData': 'COrop7EGEJaVsAUQqtiwBRCTzbAFEJeDsAUQzN-uBRDUoa8FEI3MsAUQydewBRDd6P4SEM-osAUQt-CuBRDxnLAFELfq_hIQ9eCwBRDeiP8SEKO7sAUQ1d2wBRC8-a8FENnJrwUQvZmwBRDa4LAFEPyFsAUQ0eCwBRDj0bAFEO6irwUQg7-wBRD-4LAFEKKSsAUQ4MOwBRDN17AFENuvrwUQ0-CwBRCx3LAFEOLUrgUQpcL-EhComrAFEO_NsAUQppqwBRD40rAFENfprwUQgqL_EhDus7AFEMrDsAUQgaKwBRC-irAFEJCysAUQvbauBRCVzbAFEIjjrwUQyfevBRCPxLAFEKzYsAUQ0-GvBRDh8q8FEOXDsAUQx_23IhC70q8FENCNsAUQmvCvBRD_37AFEOvo_hIQt6uwBRCigbAFEIvPsAUQt--vBRCIh7AFEMfOsAUQ2OCwBRDGw7AFEKW7sAUQ3t2wBRD0q7AFEPOhsAUQyMOwBRC--a8FEObWsAUQ57qvBRDqw68FEInorgUQp7uwBRD04LAFEIPfrwUQ9quwBRD00LAFENWIsAUQxMOwBRCe0LAFEOuTrgUQ-9qwBRDMw7AFENbWsAUQkf23IhCWpP8SEJa8sAUqIENBTVNFaFVKb0wyd0ROSGtCcUNROUF2TDFBUWRCdz09'
                    },
                    'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
                    'timeZone': 'Etc/GMT-7',
                    'browserName': 'Chrome',
                    'browserVersion': '124.0.0.0',
                    'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'deviceExperimentId': 'ChxOek0yTVRZNE16Z3dNalExTURRNU5qRTVOdz09EOrop7EGGOrop7EG',
                    'screenWidthPoints': 1803,
                    'screenHeightPoints': 1006,
                    'screenPixelDensity': 1,
                    'screenDensityFloat': 1,
                    'utcOffsetMinutes': 420,
                    'connectionType': 'CONN_CELLULAR_4G',
                    'memoryTotalKbytes': '8000000',
                    'mainAppWebInfo': {
                        'graftUrl': 'https://www.youtube.com/',
                        'pwaInstallabilityStatus': 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                        'webDisplayMode': 'WEB_DISPLAY_MODE_BROWSER',
                        'isWebNativeShareAvailable': true
                    }
                },
                'user': {
                    'lockedSafetyMode': false
                },
                'request': {
                    'useSsl': true,
                    'consistencyTokenJars': [
                        {
                            'encryptedTokenJarContents': 'AKreu9v04vvr0tfKrsA9hOwsM_2eTLq65ncLbWDInYPRxhGbsI4i5kqW8M1dlYSjlEcQEqTNqd4772kS_g_syl35EiduwlThsJueTIRzL_PQx936js-opi1mAkBusY3t4HF1NlhgoKE0b_2a9wef6RA7VpVsQEL4DAkfeYS5ma6epZ4RNByJj2jiGbxjFTEhiAvsoOJzJYlzsMihnMDaK2JPwvoWdg',
                            'expirationSeconds': '600'
                        }
                    ],
                    'internalExperimentFlags': []
                },
                'clickTracking': {
                    'clickTrackingParams': 'CAAQisQGIhMIk8ygu9vchQMV2-dMAh33AgEv'
                },
                'adSignalsInfo': {
                    'params': [
                        {
                            'key': 'dt',
                            'value': '1714025287433'
                        },
                        {
                            'key': 'flash',
                            'value': '0'
                        },
                        {
                            'key': 'frm',
                            'value': '0'
                        },
                        {
                            'key': 'u_tz',
                            'value': '420'
                        },
                        {
                            'key': 'u_his',
                            'value': '2'
                        },
                        {
                            'key': 'u_h',
                            'value': '1080'
                        },
                        {
                            'key': 'u_w',
                            'value': '1920'
                        },
                        {
                            'key': 'u_ah',
                            'value': '1080'
                        },
                        {
                            'key': 'u_aw',
                            'value': '1858'
                        },
                        {
                            'key': 'u_cd',
                            'value': '24'
                        },
                        {
                            'key': 'bc',
                            'value': '31'
                        },
                        {
                            'key': 'bih',
                            'value': '1006'
                        },
                        {
                            'key': 'biw',
                            'value': '1788'
                        },
                        {
                            'key': 'brdim',
                            'value': '0,0,0,0,1858,0,1858,1080,1803,1006'
                        },
                        {
                            'key': 'vis',
                            'value': '1'
                        },
                        {
                            'key': 'wgl',
                            'value': 'true'
                        },
                        {
                            'key': 'ca_type',
                            'value': 'image'
                        }
                    ]
                }
            },
            'actions': [
                {
                    'action': 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID',
                    'removedVideoId': '6Bf7h8hXfkk'
                }
            ],
            'playlistId': 'WL'
        })
    });
}

function apiRestful_moveToTop() {
    return fetch('https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'SAPISIDHASH 1714000399_fa4186b8c39e7d64301a77837c5abe751020c0e2',
            'content-type': 'application/json',
            'cookie': 'VISITOR_INFO1_LIVE=vzKC5Lkkt4Y; VISITOR_INFO1_LIVE=vzKC5Lkkt4Y; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; LOGIN_INFO=AFmmF2swRQIhAPiEz9MH7LfegII9kAIxw7xGExHo4x7OcgZiHjvPJW42AiBJrM0a51iEXnmG8Q0E3t4rqsCPi3QhzduNORVBtA7Qcg:QUQ3MjNmeUp2Z3BQNmN3a1ZTb1dtS0RyaGdpTll6dkdJNFRTVnJIQWEyOFR5c21NLVpXOHJjWXZKdGFndzVDNEZNczZ5WjZqYnJuS2pqTlRDOWhVX0F4cHpEak9VaHQtbVZfc3NnOHJaRkhPTEV6QkN0ZHVkbEo3YVM5RXQ1X3R5bW0tZXkxd3dfWTdqUE5RbnZVcXd6MzVEZ3daZzZQalFR; SID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQHI4fYWqk-JgoOlis4IMyLgACgYKAZYSAQASFQHGX2MiEfRSG4odkTq0nxGwE7HzFRoVAUF8yKrWTGnIYpZIDbwuL7efjozz0076; __Secure-1PSID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQfsLX8j1e_UrbjgBRLD4JewACgYKAUQSAQASFQHGX2MiG4HklqmmCgTL7mhPAkO7IBoVAUF8yKol5-wua_R_Tp0cLPNmnkXQ0076; __Secure-3PSID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQkFkqJ3dBY2HoSM-uXNodrgACgYKAVsSAQASFQHGX2MiTX0NQxXbwVzi8kl-spqaYBoVAUF8yKoI6g58e2BqXJ2YqMSuK5Ej0076; HSID=APLKfrFgb4Oqz9LdY; SSID=ArZgtjAICqqqKuCDa; APISID=51-mbtvY-9wM4Bt2/A-bcmxx5iXlF7xzyX; SAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; __Secure-1PAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; __Secure-3PAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; YSC=9NXy3FZiBVg; PREF=tz=Etc.GMT-7&f5=30000&f6=40000000; wide=0; __Secure-1PSIDTS=sidts-CjEBLwcBXNd5LHy5fvzTR7Hqr2qd2haGcItZai7ummxn3YeK9DSWnM1YNC9BMHu9EA4_EAA; __Secure-3PSIDTS=sidts-CjEBLwcBXNd5LHy5fvzTR7Hqr2qd2haGcItZai7ummxn3YeK9DSWnM1YNC9BMHu9EA4_EAA; SIDCC=AKEyXzWyYkkXbyfnaJV6cK4OPfxf0Z7hQf0OheVD3zfYAuHdeuEpmOg2o7Tzk-RTHopwqLGGKA; __Secure-1PSIDCC=AKEyXzU08iPhgGvws6wAFAH360qMHcaCqXep6vMsMj1fZ3VppOIxvW6OoQVlyee5FS1WAGeZHAM; __Secure-3PSIDCC=AKEyXzU6c2JH4E9tnFebNKDZI0Y4jpsXnfT5boRfjR7tUuK36hRqM6tuK0PJ5SFNijIf9lRHtA; CONSISTENCY=AKreu9trKmuuhYjuHH0OeHAQZqoVOIx4TJG2oZ4urrTbjVm_hK0mxOOWRKKgq8BRM8NvfCthaji0BupzKhHC6PyDrtMmS0_-rM5FDQxg4LpUQy0BxUa24Spc_bZiKlkH4PLstQDicunGiony1nfIo3Y6EKx2vzTB_fcWwDrD5MFXljPKUUl4CZXhPxiMEMVhe6YHcwgmKMxJjDEYmAc; ST-1x29qd6=session_logininfo=AFmmF2swRQIhAPiEz9MH7LfegII9kAIxw7xGExHo4x7OcgZiHjvPJW42AiBJrM0a51iEXnmG8Q0E3t4rqsCPi3QhzduNORVBtA7Qcg%3AQUQ3MjNmeUp2Z3BQNmN3a1ZTb1dtS0RyaGdpTll6dkdJNFRTVnJIQWEyOFR5c21NLVpXOHJjWXZKdGFndzVDNEZNczZ5WjZqYnJuS2pqTlRDOWhVX0F4cHpEak9VaHQtbVZfc3NnOHJaRkhPTEV6QkN0ZHVkbEo3YVM5RXQ1X3R5bW0tZXkxd3dfWTdqUE5RbnZVcXd6MzVEZ3daZzZQalFR',
            'dnt': '1',
            'origin': 'https://www.youtube.com',
            'priority': 'u=1, i',
            'referer': 'https://www.youtube.com/playlist?list=WL',
            'sec-ch-ua': '"Chromium";v="124", "Not-A.Brand";v="99", "Google Chrome";v="124"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"124.0.6367.61"',
            'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.61", "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="124.0.6367.61"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': 'Cgt2ektDNUxra3Q0WSiEpqaxBjIKCgJWThIEGgAgSw%3D%3D',
            'x-origin': 'https://www.youtube.com',
            'x-youtube-bootstrap-logged-in': 'true',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20240422.01.00'
        },
        body: JSON.stringify({
            'context': {
                'client': {
                    'hl': 'en',
                    'gl': 'VN',
                    'remoteHost': '113.187.109.246',
                    'deviceMake': '',
                    'deviceModel': '',
                    'visitorData': 'Cgt2ektDNUxra3Q0WSiEpqaxBjIKCgJWThIEGgAgSw%3D%3D',
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)',
                    'clientName': 'WEB',
                    'clientVersion': '2.20240422.01.00',
                    'osName': 'Windows',
                    'osVersion': '10.0',
                    'originalUrl': 'https://www.youtube.com/playlist?list=WL',
                    'platform': 'DESKTOP',
                    'clientFormFactor': 'UNKNOWN_FORM_FACTOR',
                    'configInfo': {
                        'appInstallData': 'CISmprEGEOrDrwUQqtiwBRDj0bAFEN7dsAUQgqL_EhDeiP8SELersAUQysOwBRDi1K4FEN3o_hIQpbuwBRC9tq4FEO6irwUQt-r-EhCJ6K4FEP7gsAUQyfevBRC34K4FEMjDsAUQlpWwBRCD368FEJeDsAUQiIewBRD40rAFENuvrwUQzdewBRDT4LAFEO6zsAUQ8ZywBRCLz7AFEKe7sAUQ9NCwBRDPqLAFEIGisAUQ0eCwBRCikrAFEKiasAUQu9KvBRDQ4LAFEKXC_hIQkLKwBRDr6P4SEJrwrwUQntCwBRD0q7AFEMzDsAUQooGwBRCs2LAFEP_fsAUQ4fKvBRCI468FEOuTrgUQg7-wBRCNzLAFEMbDsAUQ5cOwBRDgw7AFEMnXsAUQvoqwBRDX6a8FEPOhsAUQ_IWwBRDY4LAFEJXNsAUQxv23IhDZya8FENrgsAUQzN-uBRDnuq8FENPhrwUQ9OCwBRCmmrAFELz5rwUQk82wBRD14LAFEL75rwUQvZmwBRCx3LAFEKO7sAUQ1KGvBRDm1rAFENCNsAUQ1tawBRCPxLAFEMTDsAUQt--vBRD72rAFEParsAUQx86wBRDvzbAFENWIsAUQkf23IhCWvLAFEJak_xIqIENBTVNFaFVKb0wyd0ROSGtCcUNROUF2TDFBUWRCdz09'
                    },
                    'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
                    'timeZone': 'Etc/GMT-7',
                    'browserName': 'Chrome',
                    'browserVersion': '124.0.0.0',
                    'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'deviceExperimentId': 'ChxOek0yTVRVM05qY3hNalk0TmpBd05qRTJNUT09EISmprEGGISmprEG',
                    'screenWidthPoints': 1617,
                    'screenHeightPoints': 526,
                    'screenPixelDensity': 1,
                    'screenDensityFloat': 1,
                    'utcOffsetMinutes': 420,
                    'connectionType': 'CONN_CELLULAR_4G',
                    'memoryTotalKbytes': '8000000',
                    'mainAppWebInfo': {
                        'graftUrl': 'https://www.youtube.com/playlist?list=WL',
                        'pwaInstallabilityStatus': 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                        'webDisplayMode': 'WEB_DISPLAY_MODE_BROWSER',
                        'isWebNativeShareAvailable': true
                    }
                },
                'user': {
                    'lockedSafetyMode': false
                },
                'request': {
                    'useSsl': true,
                    'consistencyTokenJars': [
                        {
                            'encryptedTokenJarContents': 'AKreu9trKmuuhYjuHH0OeHAQZqoVOIx4TJG2oZ4urrTbjVm_hK0mxOOWRKKgq8BRM8NvfCthaji0BupzKhHC6PyDrtMmS0_-rM5FDQxg4LpUQy0BxUa24Spc_bZiKlkH4PLstQDicunGiony1nfIo3Y6EKx2vzTB_fcWwDrD5MFXljPKUUl4CZXhPxiMEMVhe6YHcwgmKMxJjDEYmAc',
                            'expirationSeconds': '600'
                        }
                    ],
                    'internalExperimentFlags': []
                },
                'clickTracking': {
                    'clickTrackingParams': 'CLgEEMY0GAUiEwjbms6M_tuFAxUREHsHHUeFAjU='
                },
                'adSignalsInfo': {
                    'params': [
                        {
                            'key': 'dt',
                            'value': '1714000353074'
                        },
                        {
                            'key': 'flash',
                            'value': '0'
                        },
                        {
                            'key': 'frm',
                            'value': '0'
                        },
                        {
                            'key': 'u_tz',
                            'value': '420'
                        },
                        {
                            'key': 'u_his',
                            'value': '11'
                        },
                        {
                            'key': 'u_h',
                            'value': '1080'
                        },
                        {
                            'key': 'u_w',
                            'value': '1920'
                        },
                        {
                            'key': 'u_ah',
                            'value': '1080'
                        },
                        {
                            'key': 'u_aw',
                            'value': '1857'
                        },
                        {
                            'key': 'u_cd',
                            'value': '24'
                        },
                        {
                            'key': 'bc',
                            'value': '31'
                        },
                        {
                            'key': 'bih',
                            'value': '526'
                        },
                        {
                            'key': 'biw',
                            'value': '1602'
                        },
                        {
                            'key': 'brdim',
                            'value': '0,0,0,0,1857,0,1857,1080,1617,526'
                        },
                        {
                            'key': 'vis',
                            'value': '1'
                        },
                        {
                            'key': 'wgl',
                            'value': 'true'
                        },
                        {
                            'key': 'ca_type',
                            'value': 'image'
                        }
                    ]
                }
            },
            'actions': [
                {
                    'setVideoId': '304E900B9D0FB27B',
                    'action': 'ACTION_MOVE_VIDEO_AFTER'
                }
            ],
            'params': 'CAFAAQ%3D%3D',
            'playlistId': 'WL'
        })
    });
}

function apiRestful_moveToDown() {
    return fetch('https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'SAPISIDHASH 1714001249_c9d443bd12db356275b2fcdd746e0967c6753954',
            'content-type': 'application/json',
            'cookie': 'VISITOR_INFO1_LIVE=vzKC5Lkkt4Y; VISITOR_INFO1_LIVE=vzKC5Lkkt4Y; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; LOGIN_INFO=AFmmF2swRQIhAPiEz9MH7LfegII9kAIxw7xGExHo4x7OcgZiHjvPJW42AiBJrM0a51iEXnmG8Q0E3t4rqsCPi3QhzduNORVBtA7Qcg:QUQ3MjNmeUp2Z3BQNmN3a1ZTb1dtS0RyaGdpTll6dkdJNFRTVnJIQWEyOFR5c21NLVpXOHJjWXZKdGFndzVDNEZNczZ5WjZqYnJuS2pqTlRDOWhVX0F4cHpEak9VaHQtbVZfc3NnOHJaRkhPTEV6QkN0ZHVkbEo3YVM5RXQ1X3R5bW0tZXkxd3dfWTdqUE5RbnZVcXd6MzVEZ3daZzZQalFR; SID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQHI4fYWqk-JgoOlis4IMyLgACgYKAZYSAQASFQHGX2MiEfRSG4odkTq0nxGwE7HzFRoVAUF8yKrWTGnIYpZIDbwuL7efjozz0076; __Secure-1PSID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQfsLX8j1e_UrbjgBRLD4JewACgYKAUQSAQASFQHGX2MiG4HklqmmCgTL7mhPAkO7IBoVAUF8yKol5-wua_R_Tp0cLPNmnkXQ0076; __Secure-3PSID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQkFkqJ3dBY2HoSM-uXNodrgACgYKAVsSAQASFQHGX2MiTX0NQxXbwVzi8kl-spqaYBoVAUF8yKoI6g58e2BqXJ2YqMSuK5Ej0076; HSID=APLKfrFgb4Oqz9LdY; SSID=ArZgtjAICqqqKuCDa; APISID=51-mbtvY-9wM4Bt2/A-bcmxx5iXlF7xzyX; SAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; __Secure-1PAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; __Secure-3PAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; YSC=9NXy3FZiBVg; PREF=tz=Etc.GMT-7&f5=30000&f6=40000000; wide=0; __Secure-1PSIDTS=sidts-CjEBLwcBXC3UWQAUzdkYtzlSyWko9C7UxLnpPNZoBfEg-zwT6AWDe4BPFT4Zj5wj-fUgEAA; __Secure-3PSIDTS=sidts-CjEBLwcBXC3UWQAUzdkYtzlSyWko9C7UxLnpPNZoBfEg-zwT6AWDe4BPFT4Zj5wj-fUgEAA; CONSISTENCY=AKreu9soX2TSiWWgkQOlC4ItN1ykK6aWe2vMoNflqamY45M159Y1s3nhE_dPKszuN6uOZDMzhvOOXVu3hDiJDynanpa_eBbQvV03nr0OMOoERNvbekqJUrZWmB_eA8a1526_u8npOes14m-t_TxdhCk5nQzI5fg77XyNP317pizYLNd253E5d5u-O4EnYIGKyQCIjnk8Na1siZAuSfI; SIDCC=AKEyXzXlGy7PIIEpyNU-uVYKNVS8Br2Of2uvwdqZbH7WrYpwibv-SZ-VcYge6ASpKZSXu8s81Q; __Secure-1PSIDCC=AKEyXzX89W9FnOiy8mD4vQvW7thWtprp_Ms4saLy_5BV93-J1PmYEpovOxqhkEv2z3fuHKNT5k8; __Secure-3PSIDCC=AKEyXzUWa-EQsUZfNZ5QdY_j8lym01imD2f4ISqn-VDxmCXQjmb2kM3TIjQUm5oYGvs_99sefQ; ST-1x29qd6=session_logininfo=AFmmF2swRQIhAPiEz9MH7LfegII9kAIxw7xGExHo4x7OcgZiHjvPJW42AiBJrM0a51iEXnmG8Q0E3t4rqsCPi3QhzduNORVBtA7Qcg%3AQUQ3MjNmeUp2Z3BQNmN3a1ZTb1dtS0RyaGdpTll6dkdJNFRTVnJIQWEyOFR5c21NLVpXOHJjWXZKdGFndzVDNEZNczZ5WjZqYnJuS2pqTlRDOWhVX0F4cHpEak9VaHQtbVZfc3NnOHJaRkhPTEV6QkN0ZHVkbEo3YVM5RXQ1X3R5bW0tZXkxd3dfWTdqUE5RbnZVcXd6MzVEZ3daZzZQalFR',
            'dnt': '1',
            'origin': 'https://www.youtube.com',
            'priority': 'u=1, i',
            'referer': 'https://www.youtube.com/playlist?list=WL',
            'sec-ch-ua': '"Chromium";v="124", "Not-A.Brand";v="99", "Google Chrome";v="124"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"124.0.6367.61"',
            'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.61", "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="124.0.6367.61"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': 'Cgt2ektDNUxra3Q0WSj4rKaxBjIKCgJWThIEGgAgSw%3D%3D',
            'x-origin': 'https://www.youtube.com',
            'x-youtube-bootstrap-logged-in': 'true',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20240422.01.00'
        },
        body: JSON.stringify({
            'context': {
                'client': {
                    'hl': 'en',
                    'gl': 'VN',
                    'remoteHost': '113.187.109.246',
                    'deviceMake': '',
                    'deviceModel': '',
                    'visitorData': 'Cgt2ektDNUxra3Q0WSj4rKaxBjIKCgJWThIEGgAgSw%3D%3D',
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)',
                    'clientName': 'WEB',
                    'clientVersion': '2.20240422.01.00',
                    'osName': 'Windows',
                    'osVersion': '10.0',
                    'originalUrl': 'https://www.youtube.com/playlist?list=WL',
                    'platform': 'DESKTOP',
                    'clientFormFactor': 'UNKNOWN_FORM_FACTOR',
                    'configInfo': {
                        'appInstallData': 'CPisprEGEI_EsAUQ57qvBRCJ6K4FEKaasAUQ26-vBRC-irAFEOLUrgUQ5cOwBRCju7AFENrgsAUQ9quwBRDQ4LAFEM3XsAUQ3ej-EhCnu7AFEIvPsAUQ0-GvBRDQjbAFEMrDsAUQqJqwBRD-4LAFEMzfrgUQ0eCwBRCBorAFEO6irwUQ-9qwBRCVzbAFEKzYsAUQlpWwBRC--a8FEO_NsAUQg7-wBRC3768FENnJrwUQvZmwBRDHzrAFENbWsAUQ4fKvBRD00LAFEM-osAUQydewBRDEw7AFEMbDsAUQsdywBRC3q7AFEL22rgUQvPmvBRD14LAFEI3MsAUQooGwBRDrk64FEIiHsAUQ_IWwBRD40rAFENShrwUQ8ZywBRDus7AFEJ7QsAUQ5tawBRDr6P4SEP_fsAUQmvCvBRDViLAFEPSrsAUQyMOwBRC70q8FEIjjrwUQzMOwBRDe3bAFEIKi_xIQopKwBRDT4LAFEMn3rwUQl4OwBRCq2LAFEJPNsAUQ9OCwBRCD368FENfprwUQ86GwBRC36v4SEN6I_xIQt-CuBRDG_bciEODDsAUQ49GwBRClwv4SEOrDrwUQ2OCwBRCQsrAFEKW7sAUQkv23IhCWvLAFEJak_xIqIENBTVNFaFVKb0wyd0ROSGtCcUNROUF2TDFBUWRCdz09'
                    },
                    'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
                    'timeZone': 'Etc/GMT-7',
                    'browserName': 'Chrome',
                    'browserVersion': '124.0.0.0',
                    'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'deviceExperimentId': 'ChxOek0yTVRVNE1EVXdPVFl6TWpFeU16TXdOZz09EPisprEGGPisprEG',
                    'screenWidthPoints': 1617,
                    'screenHeightPoints': 526,
                    'screenPixelDensity': 1,
                    'screenDensityFloat': 1,
                    'utcOffsetMinutes': 420,
                    'connectionType': 'CONN_CELLULAR_4G',
                    'memoryTotalKbytes': '8000000',
                    'mainAppWebInfo': {
                        'graftUrl': 'https://www.youtube.com/playlist?list=WL',
                        'pwaInstallabilityStatus': 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                        'webDisplayMode': 'WEB_DISPLAY_MODE_BROWSER',
                        'isWebNativeShareAvailable': true
                    }
                },
                'user': {
                    'lockedSafetyMode': false
                },
                'request': {
                    'useSsl': true,
                    'consistencyTokenJars': [
                        {
                            'encryptedTokenJarContents': 'AKreu9soX2TSiWWgkQOlC4ItN1ykK6aWe2vMoNflqamY45M159Y1s3nhE_dPKszuN6uOZDMzhvOOXVu3hDiJDynanpa_eBbQvV03nr0OMOoERNvbekqJUrZWmB_eA8a1526_u8npOes14m-t_TxdhCk5nQzI5fg77XyNP317pizYLNd253E5d5u-O4EnYIGKyQCIjnk8Na1siZAuSfI'
                        }
                    ],
                    'internalExperimentFlags': []
                },
                'clickTracking': {
                    'clickTrackingParams': 'CIsFEMY0GAAiEwjVq_ahgdyFAxW35UwCHY68Cis='
                },
                'adSignalsInfo': {
                    'params': [
                        {
                            'key': 'dt',
                            'value': '1714001235992'
                        },
                        {
                            'key': 'flash',
                            'value': '0'
                        },
                        {
                            'key': 'frm',
                            'value': '0'
                        },
                        {
                            'key': 'u_tz',
                            'value': '420'
                        },
                        {
                            'key': 'u_his',
                            'value': '7'
                        },
                        {
                            'key': 'u_h',
                            'value': '1080'
                        },
                        {
                            'key': 'u_w',
                            'value': '1920'
                        },
                        {
                            'key': 'u_ah',
                            'value': '1080'
                        },
                        {
                            'key': 'u_aw',
                            'value': '1857'
                        },
                        {
                            'key': 'u_cd',
                            'value': '24'
                        },
                        {
                            'key': 'bc',
                            'value': '31'
                        },
                        {
                            'key': 'bih',
                            'value': '526'
                        },
                        {
                            'key': 'biw',
                            'value': '1602'
                        },
                        {
                            'key': 'brdim',
                            'value': '0,0,0,0,1857,0,1857,1080,1617,526'
                        },
                        {
                            'key': 'vis',
                            'value': '1'
                        },
                        {
                            'key': 'wgl',
                            'value': 'true'
                        },
                        {
                            'key': 'ca_type',
                            'value': 'image'
                        }
                    ]
                }
            },
            'actions': [
                {
                    'setVideoId': '304E900B9D0FB27B',
                    'action': 'ACTION_MOVE_VIDEO_BEFORE'
                }
            ],
            'params': 'CAFAAQ%3D%3D',
            'playlistId': 'WL'
        })
    });
}

function apiRestful_moveToAfter() {
    return fetch('https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'SAPISIDHASH 1714097933_1c612e7c1bc548f935519f87930e6148fda85511',
            'content-type': 'application/json',
            'cookie': 'VISITOR_INFO1_LIVE=vzKC5Lkkt4Y; VISITOR_INFO1_LIVE=vzKC5Lkkt4Y; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; LOGIN_INFO=AFmmF2swRQIhAPiEz9MH7LfegII9kAIxw7xGExHo4x7OcgZiHjvPJW42AiBJrM0a51iEXnmG8Q0E3t4rqsCPi3QhzduNORVBtA7Qcg:QUQ3MjNmeUp2Z3BQNmN3a1ZTb1dtS0RyaGdpTll6dkdJNFRTVnJIQWEyOFR5c21NLVpXOHJjWXZKdGFndzVDNEZNczZ5WjZqYnJuS2pqTlRDOWhVX0F4cHpEak9VaHQtbVZfc3NnOHJaRkhPTEV6QkN0ZHVkbEo3YVM5RXQ1X3R5bW0tZXkxd3dfWTdqUE5RbnZVcXd6MzVEZ3daZzZQalFR; SID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQHI4fYWqk-JgoOlis4IMyLgACgYKAZYSAQASFQHGX2MiEfRSG4odkTq0nxGwE7HzFRoVAUF8yKrWTGnIYpZIDbwuL7efjozz0076; __Secure-1PSID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQfsLX8j1e_UrbjgBRLD4JewACgYKAUQSAQASFQHGX2MiG4HklqmmCgTL7mhPAkO7IBoVAUF8yKol5-wua_R_Tp0cLPNmnkXQ0076; __Secure-3PSID=g.a000iwglKqERwomCmUmirDRnRiUmiB8ze1CDAGRGVUL0o7AhBmcQkFkqJ3dBY2HoSM-uXNodrgACgYKAVsSAQASFQHGX2MiTX0NQxXbwVzi8kl-spqaYBoVAUF8yKoI6g58e2BqXJ2YqMSuK5Ej0076; HSID=APLKfrFgb4Oqz9LdY; SSID=ArZgtjAICqqqKuCDa; APISID=51-mbtvY-9wM4Bt2/A-bcmxx5iXlF7xzyX; SAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; __Secure-1PAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; __Secure-3PAPISID=Sbfs4i7gvxHCu4ph/AXeIGb1RorA3qkEsw; YSC=9NXy3FZiBVg; PREF=tz=Etc.GMT-7&f5=30000&f6=40000000; wide=0; __Secure-1PSIDTS=sidts-CjEBLwcBXLU_NkpTsJ87RCBSnQgFfWs9vpy7jEOoyuqn71CKXLPgoIUE2eSoMilvAk5HEAA; __Secure-3PSIDTS=sidts-CjEBLwcBXLU_NkpTsJ87RCBSnQgFfWs9vpy7jEOoyuqn71CKXLPgoIUE2eSoMilvAk5HEAA; CONSISTENCY=AKreu9uLYWVBvqv_8DKZPDr5DJ2x3TcUapRKqVsHkTX_VsI_wv_gNzrGwjVqkewJz2iBChtR335Ipz6jIadlKfKh0-DOJAg--2KWquU1fdVc0Lt86xmEfyDBkKCiHk642znfx7xkAyufCijC8lfNPLtK6aOI9lEoXKuvveszoOpFHzqtI7--g5wz1WbNIfkFOwKgMdJ9Mjd2Iv5f9Nc; SIDCC=AKEyXzWafPvlMl741VhhAW-qZ7-PwMFR80eFS--in5c-fPil-mYLVqJOtpWatsPKHmheXkLZyw; __Secure-1PSIDCC=AKEyXzX9crc_QA-0LdmLzmU8FfWFPGjKF9amonoio8dfFE-DPB7ow6MCty_-l6Axjm2GxjdIm8k; __Secure-3PSIDCC=AKEyXzULVsQmUGvC9wSCUVBhtWWf83LyXkCeGuYnfEEbQiNwWvcnVerK0ueZwMIqlL_sjflGtw; ST-1x29qd6=session_logininfo=AFmmF2swRQIhAPiEz9MH7LfegII9kAIxw7xGExHo4x7OcgZiHjvPJW42AiBJrM0a51iEXnmG8Q0E3t4rqsCPi3QhzduNORVBtA7Qcg%3AQUQ3MjNmeUp2Z3BQNmN3a1ZTb1dtS0RyaGdpTll6dkdJNFRTVnJIQWEyOFR5c21NLVpXOHJjWXZKdGFndzVDNEZNczZ5WjZqYnJuS2pqTlRDOWhVX0F4cHpEak9VaHQtbVZfc3NnOHJaRkhPTEV6QkN0ZHVkbEo3YVM5RXQ1X3R5bW0tZXkxd3dfWTdqUE5RbnZVcXd6MzVEZ3daZzZQalFR',
            'dnt': '1',
            'origin': 'https://www.youtube.com',
            'priority': 'u=1, i',
            'referer': 'https://www.youtube.com/playlist?list=WL',
            'sec-ch-ua': '"Chromium";v="124", "Not-A.Brand";v="99", "Google Chrome";v="124"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"124.0.6367.61"',
            'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.61", "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="124.0.6367.61"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': 'Cgt2ektDNUxra3Q0WSjon6yxBjIKCgJWThIEGgAgSw%3D%3D',
            'x-origin': 'https://www.youtube.com',
            'x-youtube-bootstrap-logged-in': 'true',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20240425.01.00'
        },
        body: JSON.stringify({
            'context': {
                'client': {
                    'hl': 'en',
                    'gl': 'VN',
                    'remoteHost': '113.187.109.246',
                    'deviceMake': '',
                    'deviceModel': '',
                    'visitorData': 'Cgt2ektDNUxra3Q0WSjon6yxBjIKCgJWThIEGgAgSw%3D%3D',
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)',
                    'clientName': 'WEB',
                    'clientVersion': '2.20240425.01.00',
                    'osName': 'Windows',
                    'osVersion': '10.0',
                    'originalUrl': 'https://www.youtube.com/playlist?list=WL',
                    'platform': 'DESKTOP',
                    'clientFormFactor': 'UNKNOWN_FORM_FACTOR',
                    'configInfo': {
                        'appInstallData': 'COifrLEGEO6zsAUQvoqwBRDM364FEParsAUQ6-j-EhCmmrAFEKe7sAUQ-NKwBRDe3bAFEOrDrwUQgqL_EhDnuq8FEP7gsAUQopKwBRD00LAFEOuTrgUQ4MOwBRD65LAFENfprwUQgaKwBRDKw7AFEJ7QsAUQj8SwBRDY4LAFEMjDsAUQ2uCwBRDh8q8FEOXDsAUQ0I2wBRDH_bciEPSrsAUQvbauBRDR4LAFEInorgUQ3ej-EhCI468FEO6irwUQ8ZywBRCNzLAFEL75rwUQt--vBRDm1rAFEPXgsAUQ1YiwBRCTzbAFENuvrwUQ9uSwBRCXg7AFEMfOsAUQ1tawBRDGw7AFEL2ZsAUQsdywBRDa5LAFENnJrwUQ-9qwBRCigbAFELfq_hIQvPmvBRCs2LAFEJCysAUQ0-GvBRDj0bAFEKO7sAUQpcL-EhDvzbAFEPTgsAUQiIewBRDV3bAFEIO_sAUQ4tSuBRCWlbAFEIvPsAUQlc2wBRDJ968FEP_fsAUQzMOwBRDEw7AFELvSrwUQ3oj_EhClu7AFEPOhsAUQqtiwBRCa8K8FENPgsAUQ1KGvBRDJ17AFELbgrgUQt6uwBRCD368FEPyFsAUQz6iwBRDN17AFEKiasAUQsJ3_EhCR_bciEIWUsAUQlrywBRCWpP8SKiBDQU1TRWhVSm9MMndETkhrQnFDUTlBdkwxQVFkQnc9PQ%3D%3D'
                    },
                    'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
                    'timeZone': 'Etc/GMT-7',
                    'browserName': 'Chrome',
                    'browserVersion': '124.0.0.0',
                    'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'deviceExperimentId': 'ChxOek0yTVRrNU5UVXdNalUyTnpVNU1qZzNOQT09EOifrLEGGOefrLEG',
                    'screenWidthPoints': 1538,
                    'screenHeightPoints': 868,
                    'screenPixelDensity': 1,
                    'screenDensityFloat': 1,
                    'utcOffsetMinutes': 420,
                    'connectionType': 'CONN_CELLULAR_4G',
                    'memoryTotalKbytes': '8000000',
                    'mainAppWebInfo': {
                        'graftUrl': 'https://www.youtube.com/playlist?list=WL',
                        'pwaInstallabilityStatus': 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                        'webDisplayMode': 'WEB_DISPLAY_MODE_MINIMAL_UI',
                        'isWebNativeShareAvailable': true
                    }
                },
                'user': {
                    'lockedSafetyMode': false
                },
                'request': {
                    'useSsl': true,
                    'consistencyTokenJars': [
                        {
                            'encryptedTokenJarContents': 'AKreu9uLYWVBvqv_8DKZPDr5DJ2x3TcUapRKqVsHkTX_VsI_wv_gNzrGwjVqkewJz2iBChtR335Ipz6jIadlKfKh0-DOJAg--2KWquU1fdVc0Lt86xmEfyDBkKCiHk642znfx7xkAyufCijC8lfNPLtK6aOI9lEoXKuvveszoOpFHzqtI7--g5wz1WbNIfkFOwKgMdJ9Mjd2Iv5f9Nc',
                            'expirationSeconds': '600'
                        }
                    ],
                    'internalExperimentFlags': []
                },
                'clickTracking': {
                    'clickTrackingParams': 'CDEQ7zsYACITCPSe2Zvp3oUDFdnZTAIdB8AIsA=='
                },
                'adSignalsInfo': {
                    'params': [
                        {
                            'key': 'dt',
                            'value': '1714097861465'
                        },
                        {
                            'key': 'flash',
                            'value': '0'
                        },
                        {
                            'key': 'frm',
                            'value': '0'
                        },
                        {
                            'key': 'u_tz',
                            'value': '420'
                        },
                        {
                            'key': 'u_his',
                            'value': '2'
                        },
                        {
                            'key': 'u_h',
                            'value': '900'
                        },
                        {
                            'key': 'u_w',
                            'value': '1600'
                        },
                        {
                            'key': 'u_ah',
                            'value': '900'
                        },
                        {
                            'key': 'u_aw',
                            'value': '1538'
                        },
                        {
                            'key': 'u_cd',
                            'value': '24'
                        },
                        {
                            'key': 'bc',
                            'value': '31'
                        },
                        {
                            'key': 'bih',
                            'value': '868'
                        },
                        {
                            'key': 'biw',
                            'value': '1523'
                        },
                        {
                            'key': 'brdim',
                            'value': '1920,0,1920,0,1538,0,1538,900,1538,868'
                        },
                        {
                            'key': 'vis',
                            'value': '1'
                        },
                        {
                            'key': 'wgl',
                            'value': 'true'
                        },
                        {
                            'key': 'ca_type',
                            'value': 'image'
                        }
                    ]
                }
            },
            'actions': [
                {
                    'action': 'ACTION_MOVE_VIDEO_AFTER',
                    'setVideoId': 'B2695FC1781B191B',
                    'movedSetVideoIdPredecessor': '18D5D7609D8446DE'
                }
            ],
            'params': 'CAFAAQ%3D%3D',
            'playlistId': 'WL'
        })
    });
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
