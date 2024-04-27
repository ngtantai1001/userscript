// ==UserScript==
// @name        Open showtime https://cinestar.com.vn/
// @namespace   Violentmonkey Scripts
// @match       https://cinestar.com.vn/*
// @grant       none
// @version     1.0
// @author      -
// @description At the select show time page
// @description Press Alt + A open all show time
// @description Alt + Click open show time similar
// @require     https://cdn.jsdelivr.net/npm/hotkeys-js@3.13.7/dist/hotkeys.min.js

// ==/UserScript==

hotkeys('alt+a', function (event, handler) {
    event.preventDefault()

    if (getShowtimeUrl().length > 10) {
        let check = confirm('Is more than 10 showtime, do you want to open all?')
        if (check) {
            getShowtimeUrl().forEach(el => window.open(el, '_blank'))
        }
    }

});

openByAltClickShowTime()
function openByAltClickShowTime() {
    document.body.addEventListener('click', function (e, options) {
        /**
         * @param {MouseEvent} e
         */
        if (e && (e.altKey == true && e.button == 0 && e.which == 1)) {
            if (e.target?.getAttribute('class')?.match(/movies-time-item/)?.length > 0) {
                getShowtimeUrl(e.target.closest('.movies-rp')).forEach(el => window.open(el, '_blank'))
            }
        }
    })
}


function getShowtimeUrl(element) {
    if (element) {
        temp = element.querySelectorAll('a')
    } else {
        temp = document.querySelectorAll('a')
    }

    temp = [...temp]
    temp = temp.filter(el => el.getAttribute('class')?.match(/movies-time-item/))
    // temp = temp.sort((a, b) => a.textContent > b.textContent ? 1 : -1)
    temp = temp.map(el => el.href)

    showtimeUrls = temp
    return showtimeUrls
}

function openAllShowTimeUrl() {
    getShowtimeUrl().forEach(el => window.open(el, '_blank'))
}

function getCinemas() {
    temp = document.querySelectorAll('a')
    temp = [...temp]
    temp = temp.filter(el => el.href?.match(/book-tickets\/.+?/))
    temp = temp.map(el => el.textContent.trim() + '|' + el.href)
    temp = [...new Set(temp)]
    temp = temp.map(el => el.split("|"))

    return temp
}
