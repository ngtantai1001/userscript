// ==UserScript==
// @name        Open showtime https://momo.vn/cinema/
// @namespace   Violentmonkey Scripts
// @match       https://momo.vn/cinema/*
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
    clickAllShowtime()
});


openByAltClickShowTime()
function openByAltClickShowTime() {
    document.body.addEventListener('click', function (e, options) {

        /**
         * @param {MouseEvent} e
        */
        if (e && (e.altKey == true && e.button == 0 && e.which == 1)) {
            if (e.target?.getAttribute('class')?.match(/tracking-engage-btn-showtime/)?.length > 0) {
                // clickShowtimeFromMouseClick(e.target.closest('.film-show'))
                clickShowtimeFromMouseClick(e.target.parentElement.parentElement.parentElement.parentElement)
            }
        }
    })
}


async function clickAllShowtime() {
    temp = f()
    console.log(temp.map(el => el.textContent))

    for (const t of temp) {
        t.click()
        console.log(t.textContent)
        await sleep(100)
    }
}


async function clickShowtimeFromMouseClick(element) {
    temp = f(element)
    console.log(temp.map(el => el.textContent))

    for (const t of temp) {
        t.click()
        console.log(t.textContent)
        await sleep(100)
    }
}

function f(element) {
    temp = document.querySelectorAll('.tracking-engage-btn-showtime')
    if (element) {
        temp = element.querySelectorAll('.tracking-engage-btn-showtime')
    }
    temp = [...temp]
    temp = temp.sort((a, b) => a.textContent > b.textContent ? 1 : -1)

    return temp
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}