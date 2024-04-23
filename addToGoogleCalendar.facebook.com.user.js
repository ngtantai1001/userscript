// ==UserScript==
// @name        New script facebook.com
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/*
// @grant       none
// @version     1.0
// @author      -
// @description Alt+A at post selected text
// @description Alt+A at post while mouse hover
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// ==/UserScript==


// on press key alt+a
document.body.addEventListener('keydown', function (e) {
    if (e.key !== 'a' || !e.altKey) return;
    e.preventDefault();
    // do something
    console.log(e)

    run()

});



var DATA = {}

function getTextSelected() {
    let text = window.getSelection().toString()

    return DATA['textSelected'] = text;
}

async function getTextMouseHover() {
    let temp
    temp = document.querySelector('[data-ad-preview="message"]:hover')
    if (temp) {

        DATA['link'] = ''
        for (let i = 0; i < 3; i++) {
            if (DATA['link']) break
            let temp2 = [...temp.offsetParent.querySelectorAll('a')]
            for (let j = 0; j < 5; j++) { temp2[j].focus(); }
            DATA['link'] = temp2.find(el => el.href.match(/posts|photo/))?.href

            await sleep(500)
        }

        return DATA['textMouseHover'] = temp.innerText
    }



    temp = document.querySelector('[role="complementary"]:hover')
    if (temp) {

        let temp2 = [...temp.querySelectorAll('a')]
        DATA['link'] = temp2.find(el => el.href.match(/posts|photo/))?.href


        return DATA['textMouseHover'] = temp.innerText
    }
}

async function run() {
    let text
    DATA['text'] = text
    text = getTextSelected()
    if (text.length < 20) {
        text = await getTextMouseHover()
    }

    if (text.length < 20) {
        return
    }

    DATA['text'] = text

    parseDate()
    parseTime()



    console.log(DATA)

    addCalendar()
}

function parseDate() {
    let date;

    let regex = /\d{1,2}[/-]\d{1,2}[/-]\d{4}/
    // m = text.match(regex)
    // if (m && m[0]) {
    //     date = m[0]
    // }
    let arrRegex = [
        [/\d{1,2}[/]\d{1,2}[/]\d{4}/, 'DD/MM/YYYY'],
        [/\d{1,2}[-]\d{1,2}[-]\d{4}/, 'DD-MM-YYYY'],
        [/\d{1,2}[\.]\d{1,2}[\.]\d{4}/, 'DD.MM.YYYY'],
    ]

    for (const regexItem of arrRegex) {
        let regex = regexItem[0]
        let format = regexItem[1]

        m = DATA['text'].match(regex)
        if (m && m[0]) {
            date = m[0]
            date = moment(date, format).format('YYYYMMDD')
            break
        }
    }


    DATA['date'] = date

    return date
}


function parseTime() {
    let time;

    let regex = /\d{1,2}[gh:]\d{1,2}/
    // m = text.match(regex)
    // if (m && m[0]) {
    //     time = m[0]
    // }

    let arrRegex = [
        [/\d{2}h\d{2}/, 'HHmm', 'h'],
        [/\d{2}g\d{2}/, 'HHmm', 'g'],
        [/\d{2}:\d{2}/, 'HHmm', ':'],
    ]
    for (const regexItem of arrRegex) {
        let regex = regexItem[0]
        let format = regexItem[1]

        m = DATA['text'].match(regex)
        if (m && m[0]) {
            time = m[0]
            time = moment(time, format).format('HHmm')
            break
        }
    }


    DATA['time'] = time

    return time
}


function addCalendar() {
    let title, description, datetimestart, datetimeend

    title = DATA['text'].split('\n')[0]
    description = DATA['link'] + "\n\n\n" + DATA['text']
    datetimestart = moment(DATA['date'] + DATA['time'], 'YYYYMMDDHHmm')
    datetimeend = moment(DATA['date'] + DATA['time'], 'YYYYMMDDHHmm')

    // if timestart invalid then set them to now
    if (!datetimestart.isValid()) {
        datetimestart = moment()
    }
    if (!datetimeend.isValid()) {
        datetimeend = moment()
    }

    // if timestart<5h then timestart 7h
    if (datetimestart.hour() < 5) {
        datetimestart.hour(7).minute(0)
    }

    // if 5h>timestart<=9h then timeend 11h30
    if (datetimestart.hour() >= 5 && datetimestart.hour() <= 9) {
        datetimeend.hour(11).minute(30)
    }

    // if 12h30>=timestart<=14h then timeend 17h30
    if (datetimestart.hour() >= 12 && datetimestart.hour() <= 14) {
        datetimeend.hour(17).minute(30)
    }

    // if 17h>=timestart<=20h then timeend 22h
    if (datetimestart.hour() >= 17 && datetimestart.hour() <= 20) {
        datetimeend.hour(22).minute(0)
    }

    datetimestart = datetimestart.toISOString()?.replaceAll(/[-:]|\.000/g, '');
    datetimeend = datetimeend.toISOString()?.replaceAll(/[-:]|\.000/g, '');

    let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${encodeURIComponent(datetimestart + "/" + datetimeend)}`
    console.log(url)
    window.open(url, '_blank')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}