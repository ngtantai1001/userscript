// ==UserScript==
// @name        New script meetup.com
// @namespace   Violentmonkey Scripts
// @match       https://www.meetup.com/*
// @grant       none
// @version     1.0
// @author      -
// @description Alt+A at post selected text
// @description Alt+A at post while mouse hover
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// ==/UserScript==


// hotkeyjs min cdn url

'#event-details'
'time[datetime]'
'[data-event-label="event-location"]'
console.log(123)

// on press key alt+a
document.body.addEventListener('keydown', function (e) {
    if (e.key !== 'a' || !e.altKey) return;
    e.preventDefault();
    // do something
    console.log(e)

    run()

});

function run() {
    let data = {}


    data['title'] = (document.querySelector('h1').innerText)
    data['text'] = (document.querySelector('#event-details').innerText)
    data['location'] = (document.querySelector('[data-event-label="event-location"]').innerText) + " " + (document.querySelector('[data-event-label="event-location"]').nextElementSibling.innerText)
    data['time'] = (document.querySelector('time[datetime]').innerText)
    data['url'] = window.location.href

    console.log(data);

    title = data['title']
    description = title + "\n" + data['url'] + data['text']

    let { datetimestart, datetimeend } = parseTime();
    let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${encodeURIComponent(datetimestart + "/" + datetimeend)}`
    console.log(url)
    window.open(url, '_blank')


}

function parseTime() {
    let temp, temp1, temp2;
    let datetimestart, datetimeend;

    temp = (document.querySelector('time[datetime]').innerText);
    temp1 = temp.split('\n');
    temp2 = temp1[1].split('to').map(x => x.replace('ICT', '')).map(x => x.trim());

    datetimestart = moment(temp1[0] + " " + temp2[0], 'LLLL');
    datetimeend = moment(temp1[0] + " " + temp2[1], 'LLLL');


    datetimestart = datetimestart.toISOString()?.replaceAll(/[-:]|\.000/g, '');
    datetimeend = datetimeend.toISOString()?.replaceAll(/[-:]|\.000/g, '');
    return { datetimestart, datetimeend };
}
