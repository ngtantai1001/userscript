// ==UserScript==
// @name        videoId_setVideoId_object youtube.com
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 29/04/2024, 7:18:08 pm
// ==/UserScript==

function addVideoAnchor() {
    let videoInfoList = [{
        "title": "1 A.M Study Session 📚 [lofi hip hop/chill beats]",
        "videoId": "lTRiuFIWV54",
        "setVideoId": "C0FFC58FB3C35C04"
    },
    {
        "title": "2 A.M Study Session 📚 [lofi hip hop/chill beats]",
        "videoId": "wAPCSnAhhC8",
        "setVideoId": "F268896C8EE37721"
    },
    {
        "title": "3 A.M Study Session 📚 [lofi hip hop/chill beats]",
        "videoId": "BTYAsjAVa3I",
        "setVideoId": "29E77FE173401075"
    }];
    let actions = videoInfoList.map(v => {
        return {
            "addedVideoId": v['videoId'],
            "action": "ACTION_ADD_VIDEO"
        }
    });

    return apiRestful_playlist(actions, 'WL')
}

document.addEventListener('keydown', async function (e) {
    if (e.key === 'b' && e.altKey) {
        console.log(e.key, e.altKey);

        await addVideoAnchor();

        await save_videoId_setVideo_object();
        await save_videoId_setVideo_object2();
    }


});

async function save_videoId_setVideo_object2() {
    let playlistId = 'WL';
    let videoId_setVideoId_object = {};
    await fetch("https://www.youtube.com/playlist?list=" + playlistId)
        .then(res => res.text()).then(text => {
            text.matchAll(/"setVideoId":"(\w+)".+?"videoId":"(\w+)"/g).forEach(m => videoId_setVideoId_object[m[2]] = m[1]);
        });
    // localStorage.setItem('videoId_setVideoId_object', JSON.stringify(videoId_setVideoId_object));
    // console.log('videoId_setVideoId_object', videoId_setVideoId_object);
    // return videoId_setVideoId_object;
}

async function save_videoId_setVideo_object() {
    let videoId_setVideoId_object = {};
    document.querySelectorAll('a').forEach(a => {
        let regex = /(watch\?v=|shorts\/)([\w\d_\-]+)/;
        let m = a.href?.match(regex);
        if (m) videoId_setVideoId_object[m[2]] = '';
    });
    console.log('videoId_setVideoId_object', videoId_setVideoId_object);

    let playlistId;

    await fetch("https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist?prettyPrint=false", {
        "headers": {
            "accept": "*/*",
            "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
            "content-type": "application/json"
        },
        "body": JSON.stringify({
            "context": ytcfg.data_.INNERTUBE_CONTEXT,
            "videoIds": Object.keys(videoId_setVideoId_object)[0],
            "excludeWatchLater": false,
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json()).then(json => {
        let matches = findAllByKey(json.contents, 'playlistAddToOptionRenderer');
        console.log(matches);
        playlistId = Array.from(matches).find(m => m.title.simpleText == 'wlsetvideoid')?.playlistId;
        console.log(playlistId);
    });

    if (!playlistId) {

        await fetch("https://www.youtube.com/youtubei/v1/playlist/create?prettyPrint=false", {
            "headers": {
                "accept": "*/*",
                "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "context": ytcfg.data_.INNERTUBE_CONTEXT,
                "title": "wlsetvideoid",
                "videoIds": Object.keys(videoId_setVideoId_object)
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(res => res.json()).then(json => {
            playlistId = json.playlistId;
            console.log("created playlistId", playlistId);
        });
    }

    await fetch("https://www.youtube.com/youtubei/v1/browse/edit_playlist?key=" + ytcfg.data_.INNERTUBE_API_KEY + "&prettyPrint=false", {
        "headers": {
            "accept": "*/*",
            "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
            "content-type": "application/json"
        },
        "body": JSON.stringify({
            "context": ytcfg.data_.INNERTUBE_CONTEXT,
            "actions": Object.keys(videoId_setVideoId_object).map(videoId => [
                {
                    "addedVideoId": videoId,
                    "action": "ACTION_ADD_VIDEO"
                }
            ]),
            "playlistId": playlistId
        }),
        "method": "POST"
    }).then(res => res.json()).then(json => {
        let matches = findAllByKey(json.playlistEditResults, 'playlistEditVideoAddedResultData');
        console.log('playlistEditVideoAddedResultData', matches);
        matches.forEach(m => videoId_setVideoId_object[m['videoId']] = m['setVideoId']);
    });

    await fetch("https://www.youtube.com/youtubei/v1/browse/edit_playlist?key=" + ytcfg.data_.INNERTUBE_API_KEY + "&prettyPrint=false", {
        "headers": {
            "accept": "*/*",
            "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
            "content-type": "application/json"
        },
        "body": JSON.stringify({
            "context": ytcfg.data_.INNERTUBE_CONTEXT,
            "actions": Object.keys(videoId_setVideoId_object).map(videoId => [
                {
                    "action": "ACTION_REMOVE_VIDEO_BY_VIDEO_ID",
                    "removedVideoId": videoId,
                }
            ]),
            "playlistId": playlistId
        }),
        "method": "POST"
    }).then(res => res.json()).then(json => {
    });


    // await fetch("https://www.youtube.com/playlist?list=" + playlistId)
    //     .then(res => res.text()).then(text => {
    //         text.matchAll(/"setVideoId":"(\w+)".+?"videoId":"(\w+)"/g).forEach(m => videoId_setVideoId_object[m[2]] = m[1]);
    //     })
    // await fetch("https://www.youtube.com/youtubei/v1/playlist/delete?prettyPrint=false", {
    //     "headers": {
    //         "accept": "*/*",
    //         "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
    //         "content-type": "application/json"
    //     },
    //     "body": JSON.stringify({
    //         "playlistId": playlistId
    //     }),
    //     "method": "POST",
    //     "mode": "cors",
    //     "credentials": "include"
    // });
    localStorage.setItem('videoId_setVideoId_object', JSON.stringify(videoId_setVideoId_object));

    return videoId_setVideoId_object;
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
            "context": ytcfg.data_.INNERTUBE_CONTEXT,
            "actions": actions,
            "playlistId": playlistId
        }),
        "method": "POST"
    });
}