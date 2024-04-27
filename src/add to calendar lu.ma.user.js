// ==UserScript==
// @name        add to calendar lu.ma
// @namespace   Violentmonkey Scripts
// @match       https://lu.ma/*
// @grant       none
// @version     1.0
// @author      -
// @description Alt+A at post selected text
// @description Alt+A at post while mouse hover
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// ==/UserScript==


// hotkeyjs min cdn url

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


    data['title'] = (document.querySelector('.top-card-content h1').innerText)
    data['text'] = (document.querySelector('.event-about-card').innerText)
    data['location'] = document.querySelector('.top-card-content .meta > *:nth-child(2)').innerText;
    data['time'] = (() => {
        let a = document.querySelector('.top-card-content .meta > div:nth-child(1) .title').innerText
        let b = document.querySelector('.top-card-content .meta > div:nth-child(1) .desc').innerText
        return a + ' ' + b;
    })()


    data['url'] = window.location.href

    console.log(data);

    let title = data['title']
    let description = data['url'] + "\n\n" + title + "\n\n" + data['time'] + "\n\n" + data['text']

    let { datetimestart, datetimeend } = parseDatetime(data['time']);
    let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${encodeURIComponent(datetimestart + "/" + datetimeend)}`
    console.log(url)
    window.open(url, '_blank')


}

function parseDatetime(strDatetime) {
    let temp, temp1, temp2;
    let datetimestart, datetimeend;

    temp = strDatetime
    console.log(temp)

    datetimestart = moment(temp.split('-')[0], 'dddd, MMMM D h:mm A')
    datetimeend = datetimestart.clone()

    if (datetimestart.hour() <= 10) {
        datetimeend.hour(11).minute(30);
    }
    else if (datetimestart.hour() <= 14) {
        datetimeend.hour(17).minute(30);
    }
    else if (datetimestart.hour() <= 20) {
        datetimeend.hour(22).minute(0);
    }


    // datetimestart = datetimestart.format()
    // datetimeend = datetimeend.format()
    datetimestart = datetimestart.toISOString()?.replaceAll(/[-:]|\.000/g, '');
    datetimeend = datetimeend.toISOString()?.replaceAll(/[-:]|\.000/g, '');
    return { datetimestart, datetimeend };
}
// parseDatetime('Saturday, May 4 8:00 AM - May 5, 9:00 PM GMT+7')