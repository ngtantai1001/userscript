// ==UserScript==
// @name        New script eventbrite.com
// @namespace   Violentmonkey Scripts
// @match       https://www.eventbrite.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 26/04/2024, 8:16:09 pm
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// ==/UserScript==

// on press key alt+a
document.body.addEventListener('keydown', function (e) {
    if (e.key !== 'a' || !e.altKey) return;
    // do something
    console.log(e)

    run()

});


function run() {
    let title = document.querySelector('.event-title').innerText;
    let datetime = document.querySelector('.date-info__full-datetime').innerText;

    let description = document.querySelector('#event-description').innerText;
    let address = document.querySelector('.location-info__address-text').innerText;
    let address2 = document.querySelector('.location-info__address-text').nextSibling.textContent;
    
    let datetimestart, datetimeend;
   


    // 'Saturday, October 26 · 9am - 6pm GMT+7'
    datetimestart = moment(datetime.split('-')[0], ['dddd, MMMM DD · hA', 'MMMM DD · hA'])
    datetimeend = datetimestart.clone().add(5, 'hour');
    datetimestart = datetimestart.toISOString()?.replaceAll(/[-:]|\.000/g, '');
    datetimeend = datetimeend.toISOString()?.replaceAll(/[-:]|\.000/g, '');

    description = window.location.href + '\n\n\n' + description

    console.log({
        title,
        datetime,
        description,
        address,
        address2,
        datetimestart,
        datetimeend
    });

    let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${encodeURIComponent(datetimestart + "/" + datetimeend)}`;
    console.log(url);
    window.open(url, '_blank');
}
